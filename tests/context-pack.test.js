import test from "node:test";
import assert from "node:assert/strict";
import {buildContextPack} from "../js/context-pack.js";
test("context pack includes retrieved sources and discloses missing evidence",()=>{
 const pack=buildContextPack({issue:{title:"Fix a crash",html_url:"https://github.com/acme/demo/issues/1",state:"open",body:"Crash details",created_at:"2026-01-01T00:00:00Z",labels:[{name:"bug"}]},repo:{full_name:"acme/demo",html_url:"https://github.com/acme/demo",language:"JavaScript",stargazers_count:12},readme:{url:"https://github.com/acme/demo/blob/main/README.md",content:"# Demo",fetchedAt:"2026-01-02T00:00:00Z"},contributing:{url:"https://github.com/acme/demo/blob/main/CONTRIBUTING.md",content:"Run tests",fetchedAt:"2026-01-02T00:00:00Z"},sourceFiles:[{name:"app.js",url:"https://github.com/acme/demo/blob/main/app.js",fetchedAt:"2026-01-02T00:00:00Z"}],errors:{Commit:"Unavailable"},fetchedAt:"2026-01-02T00:00:00Z"});
 assert.match(pack,/Crash details/);assert.match(pack,/Run tests/);assert.match(pack,/app\.js: https:\/\/github\.com\/acme\/demo\/blob\/main\/app\.js/);assert.match(pack,/Not retrieved: Commit\./);assert.match(pack,/Evidence completeness/);assert.match(pack,/INCOMPLETE/);assert.match(pack,/untrusted content/);assert.match(pack,/does not download or execute the repository/);
});
test("context pack never invents absent README, contribution guide, or source links",()=>{
 const pack=buildContextPack({issue:{title:"Unknown",html_url:"https://github.com/acme/demo/issues/2"},repo:{full_name:"acme/demo"},fetchedAt:"2026-01-02T00:00:00Z"});
 assert.match(pack,/README content was unavailable/);assert.match(pack,/separate contribution guide was not retrieved/);assert.match(pack,/No source-file links were identified/);
});

test("context pack discloses when retrieved source files were truncated",()=>{
 const pack=buildContextPack({issue:{title:"Example",html_url:"https://github.com/acme/demo/issues/1"},repo:{full_name:"acme/demo"},readme:{content:"README excerpt",truncated:true},contributing:{content:"Contribution excerpt",truncated:true},fetchedAt:"2026-01-02T00:00:00Z"});
 assert.match(pack,/README content truncated at 30000 characters/);
 assert.match(pack,/Contribution guide truncated at 15000 characters/);
});


test("rate-limited pack states completeness, keeps repository identity from the issue URL, and omits raw API errors",()=>{
 const pack=buildContextPack({issue:{title:"test(api): cover check query parameter parsing",html_url:"https://github.com/soroworks/soroprobe/issues/23",state:"open",body:"Body",labels:[{name:"good first issue"}]},repo:null,readme:null,contributing:null,sourceFiles:[],commit:null,errors:{"Issue refresh":"GitHub API rate limit reached. V36 stopped additional requests to respect the limit. Retry after 8:59:32 pm.","Repository source listing / contribution guide":"GitHub API rate limit reached."},repoIdentity:"soroworks/soroprobe",rateLimited:true,fetchedAt:"2026-10-21T15:14:42.761Z"});
 assert.match(pack,/INCOMPLETE — not retrieved: repository metadata, README, contribution guide, source-file listing, latest commit, a fresh issue refresh\./);
 assert.match(pack,/Name: soroworks\/soroprobe \(identity from the issue URL; repository metadata was not retrieved\)/);
 assert.match(pack,/URL: https:\/\/github\.com\/soroworks\/soroprobe \(from the issue URL\)/);
 assert.match(pack,/Issue data: from earlier loaded results; refresh not completed/);
 assert.match(pack,/GitHub API rate limit was reached before all evidence could be fetched/);
 assert.match(pack,/- Not retrieved: Issue refresh; Repository source listing \/ contribution guide\./);
 assert.equal(pack.includes("Retry after"),false);
 assert.equal(pack.includes("stopped additional requests"),false);
 assert.equal(pack.includes("undefined"),false);
});

test("complete packs are labelled COMPLETE and omit the incomplete reason",()=>{
 const pack=buildContextPack({issue:{title:"Fix",html_url:"https://github.com/acme/demo/issues/1",state:"open",body:"Body",created_at:"2026-01-01T00:00:00Z",v36FetchedAt:"2026-01-02T00:00:00Z",labels:[{name:"bug"}]},repo:{full_name:"acme/demo",html_url:"https://github.com/acme/demo",language:"Go",stargazers_count:3,v36FetchedAt:"2026-01-02T00:00:00Z"},readme:{url:"https://github.com/acme/demo/blob/main/README.md",content:"# Demo",fetchedAt:"2026-01-02T00:00:00Z"},contributing:{url:"https://github.com/acme/demo/blob/main/CONTRIBUTING.md",content:"Run tests",fetchedAt:"2026-01-02T00:00:00Z"},sourceFiles:[{name:"main.go",url:"https://github.com/acme/demo/blob/main/main.go",fetchedAt:"2026-01-02T00:00:00Z"}],commit:{url:"https://github.com/acme/demo/commit/abc",commitDate:"2026-01-01T00:00:00Z",fetchedAt:"2026-01-02T00:00:00Z"},fetchedAt:"2026-01-02T01:00:00Z"});
 assert.match(pack,/COMPLETE — repository metadata, README, contribution guide, source files and the latest commit were retrieved\./);
 assert.equal(pack.includes("INCOMPLETE"),false);
 assert.equal(pack.includes("Reason:"),false);
});

test("an invalid repository identity is not presented as a repository name",()=>{
 const pack=buildContextPack({issue:{title:"Fix",html_url:"https://github.com/acme/demo/issues/1"},repo:null,repoIdentity:"not a repo",fetchedAt:"2026-01-02T00:00:00Z"});
 assert.match(pack,/Name: Unavailable/);
 assert.equal(pack.includes("not a repo"),false);
});
