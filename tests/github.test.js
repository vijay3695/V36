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

test("secondary rate limits are detected from response text and retry-after",async t=>{
 t.mock.method(globalThis,"fetch",async()=>new Response(JSON.stringify({message:"You have exceeded a secondary rate limit"}),{status:403,headers:{"content-type":"application/json","retry-after":"5"}}));
 await assert.rejects(apiGet("/search/issues?q=test"),e=>e instanceof GitHubError&&e.rateLimited&&e.retryAt instanceof Date&&e.retryAt.getTime()>Date.now());
});
test("ordinary permission-denied 403 is not mislabeled as a rate limit",async t=>{
 t.mock.method(globalThis,"fetch",async()=>new Response(JSON.stringify({message:"Resource not accessible by integration"}),{status:403,headers:{"content-type":"application/json","x-ratelimit-remaining":"12"}}));
 await assert.rejects(apiGet("/repos/acme/private"),e=>e instanceof GitHubError&&e.status===403&&!e.rateLimited&&e.message==="GitHub returned HTTP 403.");
});
test("HTTP 429 honors retry-after",async t=>{
 t.mock.method(globalThis,"fetch",async()=>new Response(JSON.stringify({message:"Too many requests"}),{status:429,headers:{"content-type":"application/json","retry-after":"10"}}));
 await assert.rejects(apiGet("/search/issues?q=test"),e=>e instanceof GitHubError&&e.status===429&&e.rateLimited&&e.retryAt instanceof Date&&e.retryAt.getTime()>Date.now());
});
test("successful responses with invalid JSON return a clear parse error",async t=>{
 t.mock.method(globalThis,"fetch",async()=>new Response("not json",{status:200,headers:{"content-type":"application/json"}}));
 await assert.rejects(apiGet("/repos/acme/demo"),e=>e instanceof GitHubError&&/response that could not be read/.test(e.message));
});
test("abort errors are preserved for callers",async t=>{
 t.mock.method(globalThis,"fetch",async()=>{throw new DOMException("Aborted","AbortError");});
 await assert.rejects(apiGet("/search/issues?q=test"),e=>e.name==="AbortError");
});
test("server errors retain their HTTP status and actionable message",async t=>{
 t.mock.method(globalThis,"fetch",async()=>new Response(JSON.stringify({message:"Internal error"}),{status:500,headers:{"content-type":"application/json"}}));
 await assert.rejects(apiGet("/search/issues?q=test"),e=>e instanceof GitHubError&&e.status===500&&e.message==="GitHub returned HTTP 500.");
});
test("search requests encode page and supported sort order",async t=>{
 let requested="";
 t.mock.method(globalThis,"fetch",async url=>{requested=String(url);return new Response(JSON.stringify({total_count:0,items:[]}),{status:200,headers:{"content-type":"application/json"}});});
 await searchIssues("is:open",{page:3,sort:"comments"});
 const url=new URL(requested);
 assert.equal(url.searchParams.get("page"),"3");assert.equal(url.searchParams.get("sort"),"comments");assert.equal(url.searchParams.get("order"),"desc");
});
test("repository file paths encode each segment without losing nested paths",async t=>{
 let requested="";
 t.mock.method(globalThis,"fetch",async url=>{requested=String(url);return new Response(JSON.stringify({encoding:"base64",content:Buffer.from("Guide").toString("base64"),html_url:"https://github.com/acme/demo/blob/main/docs/Contributing%20Guide.md"}),{status:200,headers:{"content-type":"application/json"}});});
 const file=await getRepoFile("acme","demo","docs/Contributing Guide.md");
 assert.equal(new URL(requested).pathname,"/repos/acme/demo/contents/docs/Contributing%20Guide.md");
 assert.equal(file.content,"Guide");
});
