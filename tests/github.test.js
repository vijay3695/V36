import test from "node:test";
import assert from "node:assert/strict";
import {apiGet,GitHubError,searchIssues,getRepoFile} from "../js/github.js";

test("GitHub rate limits stop requests and expose retry timing",async t=>{
 const reset=Math.floor(Date.now()/1000)+120;
 t.mock.method(globalThis,"fetch",async()=>new Response(JSON.stringify({message:"API rate limit exceeded"}),{status:403,headers:{"content-type":"application/json","x-ratelimit-remaining":"0","x-ratelimit-reset":String(reset)}}));
 await assert.rejects(apiGet("/repos/acme/demo"),e=>e instanceof GitHubError&&e.rateLimited&&e.retryAt instanceof Date&&e.retryAt.getTime()>=reset*1000);
});
test("missing GitHub resources return a clear 404 error",async t=>{
 t.mock.method(globalThis,"fetch",async()=>new Response(JSON.stringify({message:"Not Found"}),{status:404,headers:{"content-type":"application/json"}}));
 await assert.rejects(apiGet("/repos/acme/missing"),e=>e instanceof GitHubError&&e.status===404&&/moved, been deleted, or become inaccessible/.test(e.message));
});
test("network errors are normalized for users",async t=>{
 t.mock.method(globalThis,"fetch",async()=>{throw new Error("offline detail");});
 await assert.rejects(apiGet("/search/issues?q=test"),e=>e instanceof GitHubError&&/Network request failed/.test(e.message));
});
test("GitHub relevance sort leaves sort and order unset",async t=>{
 let requested="";
 t.mock.method(globalThis,"fetch",async url=>{requested=String(url);return new Response(JSON.stringify({total_count:0,items:[]}),{status:200,headers:{"content-type":"application/json"}});});
 await searchIssues("is:open",{sort:"relevance"});
 const url=new URL(requested);
 assert.equal(url.searchParams.get("sort"),null);
 assert.equal(url.searchParams.get("order"),null);
 assert.equal(url.searchParams.get("per_page"),"20");
});
test("repository file content is decoded from GitHub's base64 response",async t=>{
 t.mock.method(globalThis,"fetch",async()=>new Response(JSON.stringify({encoding:"base64",content:Buffer.from("# Contribution guide").toString("base64"),html_url:"https://github.com/acme/demo/blob/main/CONTRIBUTING.md"}),{status:200,headers:{"content-type":"application/json"}}));
 const file=await getRepoFile("acme","demo","CONTRIBUTING.md");
 assert.equal(file.content,"# Contribution guide");
 assert.equal(file.url,"https://github.com/acme/demo/blob/main/CONTRIBUTING.md");
});

test("large README responses are bounded and marked truncated",async t=>{
 const content="x".repeat(30001);
 t.mock.method(globalThis,"fetch",async()=>new Response(JSON.stringify({content:Buffer.from(content).toString("base64"),encoding:"base64",html_url:"https://github.com/acme/demo/blob/main/README.md"}),{status:200,headers:{"content-type":"application/json"}}));
 const readme=await (await import("../js/github.js")).getReadme("acme","demo");
 assert.equal(readme.content.length,30000);
 assert.equal(readme.truncated,true);
});
