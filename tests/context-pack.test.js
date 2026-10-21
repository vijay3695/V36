import test from "node:test";
import assert from "node:assert/strict";
import {buildContextPack} from "../js/context-pack.js";
test("context pack includes retrieved sources and discloses missing evidence",()=>{
 const pack=buildContextPack({issue:{title:"Fix a crash",html_url:"https://github.com/acme/demo/issues/1",state:"open",body:"Crash details",created_at:"2026-01-01T00:00:00Z",labels:[{name:"bug"}]},repo:{full_name:"acme/demo",html_url:"https://github.com/acme/demo",language:"JavaScript",stargazers_count:12},readme:{url:"https://github.com/acme/demo/blob/main/README.md",content:"# Demo",fetchedAt:"2026-01-02T00:00:00Z"},contributing:{url:"https://github.com/acme/demo/blob/main/CONTRIBUTING.md",content:"Run tests",fetchedAt:"2026-01-02T00:00:00Z"},sourceFiles:[{name:"app.js",url:"https://github.com/acme/demo/blob/main/app.js",fetchedAt:"2026-01-02T00:00:00Z"}],errors:{Commit:"Unavailable"},fetchedAt:"2026-01-02T00:00:00Z"});
 assert.match(pack,/Crash details/);assert.match(pack,/Run tests/);assert.match(pack,/app\.js: https:\/\/github\.com\/acme\/demo\/blob\/main\/app\.js/);assert.match(pack,/Commit: Unavailable/);assert.match(pack,/untrusted content/);assert.match(pack,/does not download or execute the repository/);
});
test("context pack never invents absent README, contribution guide, or source links",()=>{
 const pack=buildContextPack({issue:{title:"Unknown",html_url:"https://github.com/acme/demo/issues/2"},repo:{full_name:"acme/demo"},fetchedAt:"2026-01-02T00:00:00Z"});
 assert.match(pack,/README content was unavailable/);assert.match(pack,/separate contribution guide was not retrieved/);assert.match(pack,/No source-file links were identified/);
});
