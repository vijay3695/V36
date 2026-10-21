import test from "node:test";
import assert from "node:assert/strict";
import {validateBackup,mergeBackup,exportBackup,parseImportFile,MAX_IMPORT_BYTES} from "../js/storage.js";
const backup={version:1,exportedAt:"2026-01-01T00:00:00Z",issues:[{url:"https://github.com/acme/demo/issues/1",title:"Bug",repository:"acme/demo",number:1}],searches:[{id:"one",name:"bugs",filters:{query:"bug",labels:["bug"],sort:"updated"}}]};
test("validates versioned backup and canonical issue URLs",()=>{const x=validateBackup(backup);assert.equal(x.issues.length,1);assert.equal(x.issues[0].url,"https://github.com/acme/demo/issues/1");});
test("rejects invalid versions and structures",()=>{assert.throws(()=>validateBackup({version:2,issues:[],searches:[]}),/Unsupported/);assert.throws(()=>validateBackup({version:1,issues:{},searches:[]}),/Unsupported/);});
test("discards unsafe URLs and deduplicates issues",()=>{const x=validateBackup({...backup,issues:[...backup.issues,{...backup.issues[0]},{url:"javascript:alert(1)"}]});assert.equal(x.issues.length,1);});
test("deduplicates equivalent saved searches",()=>{const x=validateBackup({...backup,searches:[...backup.searches,{...backup.searches[0],id:"other"}]});assert.equal(x.searches.length,1);});
test("merging preserves unrelated references",()=>{const other={version:1,issues:[{url:"https://github.com/acme/demo/issues/2",title:"Other"}],searches:[]};const x=mergeBackup(validateBackup(backup),validateBackup(other));assert.equal(x.issues.length,2);});
test("exports versioned JSON",()=>{assert.equal(JSON.parse(exportBackup(validateBackup(backup))).version,1);});
test("import size is capped at one megabyte",()=>assert.equal(MAX_IMPORT_BYTES,1048576));

test("saved custom date and exact star filters survive backup validation",()=>{
 const filters={query:"bug",labels:[],sort:"relevance",createdDays:"30",createdAfter:"2026-01-01",createdBefore:"2026-01-31",updatedAfter:"",updatedBefore:"",commitAfter:"2025-01-01",commitBefore:"",pushAgeDays:"90",pushAfter:"2025-12-01",pushBefore:"",stars:"0-99",minStars:"25",maxStars:"500"};
 const x=validateBackup({...backup,searches:[{name:"custom",filters}]});
 assert.equal(x.searches[0].filters.createdAfter,"2026-01-01");
 assert.equal(x.searches[0].filters.createdDays,"");
 assert.equal(x.searches[0].filters.pushAfter,"2025-12-01");
 assert.equal(x.searches[0].filters.pushAgeDays,"");
 assert.equal(x.searches[0].filters.stars,"");
 assert.equal(x.searches[0].filters.maxStars,"500");
 assert.equal(x.searches[0].filters.sort,"relevance");
});

test("import reports accepted, rejected and duplicate records",async()=>{
 const raw={version:1,issues:[backup.issues[0],{...backup.issues[0]},{url:"javascript:alert(1)"}],searches:[backup.searches[0],{name:"invalid"}]};
 const json=JSON.stringify(raw);
 const parsed=await parseImportFile({size:json.length,text:async()=>json});
 assert.deepEqual(parsed.importReport,{acceptedIssues:1,rejectedIssues:1,duplicateIssues:1,acceptedSearches:1,rejectedSearches:1,duplicateSearches:0});
});
test("oversized import is rejected before its contents are read",async()=>{
 let read=false;
 await assert.rejects(parseImportFile({size:MAX_IMPORT_BYTES+1,text:async()=>{read=true;return "{}";}}),/1 MB import limit/);
 assert.equal(read,false);
});

test("unsupported saved-search categories are discarded during import",()=>{
 const x=validateBackup({...backup,searches:[{name:"bad category",filters:{query:"bug",category:"Make up a category",sort:"updated"}}]});
 assert.equal(x.searches[0].filters.category,"");
});
test("saved-search labels are trimmed, deduplicated and sorted",()=>{
 const x=validateBackup({...backup,searches:[{name:"labels",filters:{query:"bug",labels:[" z ","a","a",""],sort:"updated"}}]});
 assert.deepEqual(x.searches[0].filters.labels,[" z ","a"]);
});
test("saved-search date ranges reject impossible calendar dates",()=>{
 const x=validateBackup({...backup,searches:[{name:"dates",filters:{createdAfter:"2026-02-31",updatedBefore:"2026-12-31",sort:"updated"}}]});
 assert.equal(x.searches[0].filters.createdAfter,"");
 assert.equal(x.searches[0].filters.updatedBefore,"2026-12-31");
});
test("saved-search invalid star bounds are discarded",()=>{
 const x=validateBackup({...backup,searches:[{name:"stars",filters:{minStars:"-1",maxStars:"500",stars:"100-999",sort:"updated"}}]});
 assert.equal(x.searches[0].filters.minStars,"");
 assert.equal(x.searches[0].filters.maxStars,"500");
 assert.equal(x.searches[0].filters.stars,"");
});
test("pull request references remain portable saved items",()=>{
 const x=validateBackup({...backup,issues:[{url:"https://github.com/acme/demo/pull/8",title:"PR",repository:"acme/demo",number:8}]});
 assert.equal(x.issues[0].url,"https://github.com/acme/demo/pull/8");
 assert.equal(x.issues[0].number,8);
});
test("trailing slash variants canonicalize to one issue identity",()=>{
 const x=validateBackup({...backup,issues:[
  {url:"https://github.com/acme/demo/issues/9/",title:"One"},
  {url:"https://github.com/acme/demo/issues/9",title:"Duplicate"}
 ]});
 assert.equal(x.issues.length,1);
 assert.equal(x.issues[0].url,"https://github.com/acme/demo/issues/9");
});
test("malformed JSON imports reject without producing a partial backup",async()=>{
 await assert.rejects(parseImportFile({size:4,text:async()=>"nope"}));
});
test("import refuses item arrays over the configured cap",()=>{
 const issues=Array.from({length:2001},(_,i)=>({url:"https://github.com/acme/demo/issues/"+(i+1),title:"Issue"}));
 assert.throws(()=>validateBackup({version:1,issues,searches:[]}),/too many items/);
});
