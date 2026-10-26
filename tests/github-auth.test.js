import test from "node:test";
import assert from "node:assert/strict";
import {connectGitHubToken,disconnectGitHubToken,getGitHubToken,hasGitHubToken,isTokenRemembered,restoreRememberedToken} from "../js/github-auth.js";
import {apiGet,GitHubError} from "../js/github.js";

const VALID="github_pat_"+"A".repeat(40);
function installStorage(t,initial={}) {
  const values=new Map(Object.entries(initial));
  const previous=Object.getOwnPropertyDescriptor(globalThis,"localStorage");
  Object.defineProperty(globalThis,"localStorage",{configurable:true,value:{
    getItem:key=>values.has(key)?values.get(key):null,
    setItem:(key,value)=>values.set(key,String(value)),
    removeItem:key=>values.delete(key)
  }});
  t.after(()=>{disconnectGitHubToken();if(previous)Object.defineProperty(globalThis,"localStorage",previous);else delete globalThis.localStorage;});
  return values;
}

test("token validation uses only the fixed GitHub API origin and does not store by default",async t=>{
  installStorage(t);
  let requested="",headers={};
  t.mock.method(globalThis,"fetch",async(url,options)=>{requested=String(url);headers=options.headers;return new Response(JSON.stringify({resources:{core:{limit:5000,remaining:4999}}}),{status:200,headers:{"content-type":"application/json"}});});
  const result=await connectGitHubToken(VALID,false);
  assert.equal(requested,"https://api.github.com/rate_limit");
  assert.equal(headers.Authorization,"Bearer "+VALID);
  assert.equal(result.remembered,false);
  assert.equal(getGitHubToken(),VALID);
  assert.equal(isTokenRemembered(),false);
});

test("remembering a token is opt-in and disconnect removes the stored copy",async t=>{
  const values=installStorage(t);
  t.mock.method(globalThis,"fetch",async()=>new Response(JSON.stringify({resources:{core:{limit:5000,remaining:4999}}}),{status:200,headers:{"content-type":"application/json"}}));
  const result=await connectGitHubToken(VALID,true);
  assert.equal(result.remembered,true);
  assert.equal(values.get("v36.github-token.v1"),VALID);
  assert.equal(isTokenRemembered(),true);
  disconnectGitHubToken();
  assert.equal(hasGitHubToken(),false);
  assert.equal(values.has("v36.github-token.v1"),false);
});

test("invalid token format is rejected before any network request",async t=>{
  installStorage(t);
  let calls=0;
  t.mock.method(globalThis,"fetch",async()=>{calls++;return new Response("{}",{status:200});});
  await assert.rejects(connectGitHubToken("not-a-token"),/format is not recognized/);
  assert.equal(calls,0);
  assert.equal(hasGitHubToken(),false);
});

test("rejected token does not replace an active token",async t=>{
  installStorage(t);
  t.mock.method(globalThis,"fetch",async()=>new Response("{}",{status:401}));
  await assert.rejects(connectGitHubToken(VALID,false),/did not accept this token/);
  assert.equal(hasGitHubToken(),false);
});

test("remembered token can be restored after reload",async t=>{
  installStorage(t,{"v36.github-token.v1":VALID});
  assert.equal(restoreRememberedToken(),true);
  assert.equal(getGitHubToken(),VALID);
  assert.equal(isTokenRemembered(),true);
});

test("GitHub API requests attach token only to the fixed API origin",async t=>{
  installStorage(t);
  t.mock.method(globalThis,"fetch",async(url,options)=>new Response(JSON.stringify({ok:true,authorization:options.headers.Authorization}),{status:200,headers:{"content-type":"application/json"}}));
  await connectGitHubToken(VALID,false);
  const response=await apiGet("/rate_limit");
  assert.equal(response.data.authorization,"Bearer "+VALID);
  await assert.rejects(apiGet("//attacker.example/path"),e=>e instanceof GitHubError&&/Invalid GitHub API path/.test(e.message));
});

test("disconnect restores anonymous API requests",async t=>{
  installStorage(t);
  const seen=[];
  t.mock.method(globalThis,"fetch",async(url,options)=>{seen.push({url:String(url),authorization:options.headers.Authorization});return new Response(JSON.stringify({ok:true}),{status:200,headers:{"content-type":"application/json"}});});
  await connectGitHubToken(VALID,false);
  await apiGet("/rate_limit");
  disconnectGitHubToken();
  assert.equal(getGitHubToken(),"");
  await apiGet("/rate_limit");
  assert.equal(seen[0].authorization,"Bearer "+VALID); // token validation request
  assert.equal(seen[1].authorization,"Bearer "+VALID); // authenticated API request
  assert.equal(seen[2].authorization,undefined); // anonymous after disconnect
});
