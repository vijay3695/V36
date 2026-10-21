import test from "node:test";
import assert from "node:assert/strict";
import {inferCategories,matchesFilters,buildSearchQuery,normalizeFilters,withinDays,unknownFilterReasons,describeFilters} from "../js/filters.js";
const now=Date.parse("2026-01-31T00:00:00Z");
const issue={title:"Fix crash and add regression tests",body:"The bug crashes the app.",created_at:"2026-01-20T00:00:00Z",updated_at:"2026-01-30T00:00:00Z",labels:[{name:"bug"}],repository:{full_name:"demo/project",language:"JavaScript",stargazers_count:42,latestCommitDate:"2026-01-25T00:00:00Z"}};
test("category inference allows multiple supported categories",()=>{const c=inferCategories(issue);assert.ok(c.includes("Bug fix"));assert.ok(c.includes("Tests"));});
test("unknown category is explicit",()=>assert.deepEqual(inferCategories({title:"Hello",body:"",labels:[]}),["Other/No category inferred"]));
test("AND filters require all selected constraints",()=>{assert.equal(matchesFilters(issue,{query:"crash",language:"JavaScript",labels:["bug"],createdDays:"30",updatedDays:"7",stars:"0-99",commitAgeDays:"30"},now),true);assert.equal(matchesFilters({...issue,repository:{...issue.repository,languages:["JavaScript"]}},{query:"crash",language:"Python"},now),false);});
test("date helper rejects unknown and future dates",()=>{assert.equal(withinDays("not-a-date",30,now),false);assert.equal(withinDays("2026-02-01T00:00:00Z",30,now),false);});
test("query uses supported qualifiers and removes label quotes",()=>{const q=buildSearchQuery({query:"memory leak",language:"JavaScript",labels:['good "first" issue'],issueType:"issue",createdDays:"30"});assert.match(q,/is:open/);assert.doesNotMatch(q,/language:JavaScript/);assert.match(q,/is:issue/);assert.doesNotMatch(q,/good "first" issue/);});
test("normalization drops unsupported filter values",()=>{const f=normalizeFilters({sort:"nope",stars:"any",createdDays:"999",labels:["b","a","a"]});assert.equal(f.sort,"updated");assert.equal(f.stars,"");assert.equal(f.createdDays,"");assert.deepEqual(f.labels,["a","b"]);});

test("custom date ranges include boundary dates and reject missing/future dates",()=>{
 const f=normalizeFilters({createdAfter:"2026-01-20",createdBefore:"2026-01-30"});
 assert.equal(matchesFilters({...issue,created_at:"2026-01-20T00:00:00Z"},f,now),true);
 assert.equal(matchesFilters({...issue,created_at:"2026-01-30T23:59:59Z"},f,now),true);
 assert.equal(matchesFilters({...issue,created_at:"2026-01-31T00:00:00Z"},f,now),false);
 const missing={...issue,created_at:null};assert.equal(matchesFilters(missing,f,now),true);assert.deepEqual(unknownFilterReasons(missing,f),["issue creation date"]);
});
test("custom date ranges override age presets and become GitHub qualifiers",()=>{
 const f=normalizeFilters({createdDays:"7",createdAfter:"2026-01-10",createdBefore:"2026-01-20",updatedAfter:"2026-01-15"});
 assert.equal(f.createdDays,"");
 const q=buildSearchQuery(f,now);
 assert.match(q,/created:>=2026-01-10/);assert.match(q,/created:<=2026-01-20/);assert.match(q,/updated:>=2026-01-15/);
});
test("exact star bounds are applied and override star presets",()=>{
 const f=normalizeFilters({stars:"0-99",minStars:"100",maxStars:"250"});
 assert.equal(f.stars,"");
 assert.equal(matchesFilters({...issue,repository:{...issue.repository,stargazers_count:150}},f,now),true);
 assert.equal(matchesFilters({...issue,repository:{...issue.repository,stargazers_count:300}},f,now),false);
 assert.match(buildSearchQuery(f),/stars:>=100/);assert.match(buildSearchQuery(f),/stars:<=250/);
});
test("relevance sort is accepted",()=>assert.equal(normalizeFilters({sort:"relevance"}).sort,"relevance"));
test("invalid custom dates and negative star counts are discarded",()=>{
 const f=normalizeFilters({createdAfter:"2026-02-31",minStars:"-2",maxStars:"not-a-number"});
 assert.equal(f.createdAfter,"");assert.equal(f.minStars,"");assert.equal(f.maxStars,"");
});

test("unknown metadata remains visible and identifies filters that could not be evaluated",()=>{
 const f=normalizeFilters({language:"Python",labels:["bug"],createdAfter:"2026-01-01",updatedAfter:"2026-01-01",minStars:"100",commitAfter:"2026-01-01"});
 const incomplete={...issue,labels:undefined,created_at:null,updated_at:null,repository:{full_name:"demo/project",language:"JavaScript",stargazers_count:null}};
 assert.equal(matchesFilters(incomplete,f,now),true);
 assert.deepEqual(unknownFilterReasons(incomplete,f),["language metadata","labels","issue creation date","issue update date","repository star count","latest commit date"]);
});
test("known mismatching metadata still rejects a result",()=>{
 const f=normalizeFilters({language:"Python",minStars:"100",commitAfter:"2026-01-01"});
 const known={...issue,repository:{...issue.repository,languages:["JavaScript"],stargazers_count:42,latestCommitDate:"2026-01-25T00:00:00Z"}};
 assert.equal(matchesFilters(known,f,now),false);
});
test("missing star count is not treated as zero stars",()=>{
 const f=normalizeFilters({stars:"0-99"});
 const unknown={...issue,repository:{...issue.repository,stargazers_count:null}};
 assert.equal(matchesFilters(unknown,f,now),true);
 assert.deepEqual(unknownFilterReasons(unknown,f),["repository star count"]);
});

test("language filter checks all known repository languages",()=>{
 const f=normalizeFilters({language:"Python"});
 assert.equal(matchesFilters({...issue,repository:{...issue.repository,languages:["JavaScript","Python"]}},f,now),true);
 assert.equal(matchesFilters({...issue,repository:{...issue.repository,languages:["JavaScript"]}},f,now),false);
});
test("official label filters require every selected label and ignore case",()=>{
 assert.equal(matchesFilters(issue,normalizeFilters({labels:["BUG"]}),now),true);
 assert.equal(matchesFilters(issue,normalizeFilters({labels:["bug","enhancement"]}),now),false);
});
test("issue type filter distinguishes issues from pull requests",()=>{
 assert.equal(matchesFilters(issue,normalizeFilters({issueType:"issue"}),now),true);
 assert.equal(matchesFilters(issue,normalizeFilters({issueType:"pr"}),now),false);
 assert.equal(matchesFilters({...issue,pull_request:{html_url:"https://github.com/demo/project/pull/2"}},normalizeFilters({issueType:"pr"}),now),true);
});
test("known out-of-range creation, update, and commit dates are rejected",()=>{
 assert.equal(matchesFilters({...issue,created_at:"2025-10-01T00:00:00Z"},normalizeFilters({createdDays:"30"}),now),false);
 assert.equal(matchesFilters({...issue,updated_at:"2025-12-01T00:00:00Z"},normalizeFilters({updatedDays:"7"}),now),false);
 assert.equal(matchesFilters({...issue,repository:{...issue.repository,latestCommitDate:"2025-12-01T00:00:00Z"}},normalizeFilters({commitAgeDays:"30"}),now),false);
});
test("star preset boundaries are inclusive",()=>{
 const f=normalizeFilters({stars:"0-99"});
 assert.equal(matchesFilters({...issue,repository:{...issue.repository,stargazers_count:0}},f,now),true);
 assert.equal(matchesFilters({...issue,repository:{...issue.repository,stargazers_count:99}},f,now),true);
 assert.equal(matchesFilters({...issue,repository:{...issue.repository,stargazers_count:100}},f,now),false);
});

test("repository push date filters are distinct from latest commit filters",()=>{
 const f=normalizeFilters({commitAfter:"2026-01-01",pushAgeDays:"30",pushAfter:"2026-01-10",pushBefore:"2026-01-25"});
 assert.equal(f.pushAgeDays,"");
 const pushed={...issue,repository:{...issue.repository,latestCommitDate:"2026-01-28T00:00:00Z",pushed_at:"2026-01-20T00:00:00Z"}};
 assert.equal(matchesFilters(pushed,f,now),true);
 assert.equal(matchesFilters({...pushed,repository:{...pushed.repository,pushed_at:"2026-01-26T00:00:00Z"}},f,now),false);
 const unknown={...pushed,repository:{...pushed.repository,pushed_at:null}};
 assert.equal(matchesFilters(unknown,f,now),true);
 assert.deepEqual(unknownFilterReasons(unknown,f),["repository last push date"]);
});
test("repository push age preset rejects known stale repositories",()=>{
 const f=normalizeFilters({pushAgeDays:"30"});
 assert.equal(matchesFilters({...issue,repository:{...issue.repository,pushed_at:"2025-12-01T00:00:00Z"}},f,now),false);
});

test("all age filters are opt-in so older projects remain visible by default",()=>{
 const f=normalizeFilters({});
 assert.equal(f.createdDays,"");assert.equal(f.updatedDays,"");assert.equal(f.commitAgeDays,"");assert.equal(f.pushAgeDays,"");
 assert.equal(f.createdAfter,"");assert.equal(f.updatedAfter,"");assert.equal(f.commitAfter,"");assert.equal(f.pushAfter,"");
});

test("custom push date includes both date boundaries",()=>{const f=normalizeFilters({pushAfter:"2026-01-20",pushBefore:"2026-01-30"});assert.equal(matchesFilters({...issue,repository:{...issue.repository,pushed_at:"2026-01-20T00:00:00Z"}},f,now),true);assert.equal(matchesFilters({...issue,repository:{...issue.repository,pushed_at:"2026-01-30T23:59:59Z"}},f,now),true);assert.equal(matchesFilters({...issue,repository:{...issue.repository,pushed_at:"2026-01-31T00:00:00Z"}},f,now),false);});
test("future push timestamps do not satisfy a push-age preset",()=>assert.equal(matchesFilters({...issue,repository:{...issue.repository,pushed_at:"2026-02-01T00:00:00Z"}},normalizeFilters({pushAgeDays:"30"}),now),false));
test("custom push date bounds override a preset and survive normalization",()=>{const f=normalizeFilters({pushAgeDays:"30",pushAfter:"2026-01-01",pushBefore:"2026-01-20"});assert.equal(f.pushAgeDays,"");assert.equal(f.pushAfter,"2026-01-01");assert.equal(f.pushBefore,"2026-01-20");});
test("custom date parser rejects impossible calendar dates",()=>{const f=normalizeFilters({createdAfter:"2026-02-31",updatedBefore:"2026-13-01",commitAfter:"2026-01-01"});assert.equal(f.createdAfter,"");assert.equal(f.updatedBefore,"");assert.equal(f.commitAfter,"2026-01-01");});
test("maximum-only star filter is inclusive at its upper boundary",()=>{const f=normalizeFilters({maxStars:"150"});assert.equal(matchesFilters({...issue,repository:{...issue.repository,stargazers_count:150}},f,now),true);assert.equal(matchesFilters({...issue,repository:{...issue.repository,stargazers_count:151}},f,now),false);});
test("minimum-only star filter is inclusive at its lower boundary",()=>{const f=normalizeFilters({minStars:"150"});assert.equal(matchesFilters({...issue,repository:{...issue.repository,stargazers_count:150}},f,now),true);assert.equal(matchesFilters({...issue,repository:{...issue.repository,stargazers_count:149}},f,now),false);});
test("unknown labels stay visible with explicit uncertainty instead of being discarded",()=>{const f=normalizeFilters({labels:["bug"]});const unknown={...issue,labels:null};assert.equal(matchesFilters(unknown,f,now),true);assert.deepEqual(unknownFilterReasons(unknown,f),["labels"]);});
test("category inference requires evidence and does not infer from unrelated text",()=>{assert.deepEqual(inferCategories({title:"Hello world",body:"A friendly greeting",labels:[]}),["Other/No category inferred"]);assert.ok(inferCategories({title:"Fix regression",body:"",labels:[]}).includes("Bug fix"));});
test("language matching is case-insensitive across repository language metadata",()=>{const f=normalizeFilters({language:"python"});assert.equal(matchesFilters({...issue,repository:{...issue.repository,languages:["JavaScript","Python"]}},f,now),true);});
test("malformed star ranges are normalized to no preset",()=>{assert.equal(normalizeFilters({stars:"100-999999"}).stars,"");assert.equal(normalizeFilters({stars:"100-999"}).stars,"100-999");});

test("custom update date range applies inclusive start and end boundaries",()=>{
 const f=normalizeFilters({updatedAfter:"2026-01-20",updatedBefore:"2026-01-30"});
 assert.equal(matchesFilters({...issue,updated_at:"2026-01-20T00:00:00Z"},f,now),true);
 assert.equal(matchesFilters({...issue,updated_at:"2026-01-30T23:59:59Z"},f,now),true);
 assert.equal(matchesFilters({...issue,updated_at:"2026-01-31T00:00:00Z"},f,now),false);
});
test("custom latest-commit date range applies inclusive boundaries",()=>{
 const f=normalizeFilters({commitAfter:"2026-01-20",commitBefore:"2026-01-30"});
 assert.equal(matchesFilters({...issue,repository:{...issue.repository,latestCommitDate:"2026-01-20T00:00:00Z"}},f,now),true);
 assert.equal(matchesFilters({...issue,repository:{...issue.repository,latestCommitDate:"2026-01-30T23:59:59Z"}},f,now),true);
 assert.equal(matchesFilters({...issue,repository:{...issue.repository,latestCommitDate:"2026-01-31T00:00:00Z"}},f,now),false);
});
test("future update, commit and push dates never satisfy custom bounds",()=>{
 const f=normalizeFilters({updatedBefore:"2026-01-30",commitBefore:"2026-01-30",pushBefore:"2026-01-30"});
 assert.equal(matchesFilters({...issue,updated_at:"2026-02-01T00:00:00Z"},f,now),false);
 assert.equal(matchesFilters({...issue,repository:{...issue.repository,latestCommitDate:"2026-02-01T00:00:00Z",pushed_at:"2026-02-01T00:00:00Z"}},f,now),false);
});
test("inverted custom date bounds cannot match an issue",()=>{
 const f=normalizeFilters({createdAfter:"2026-01-30",createdBefore:"2026-01-20"});
 assert.equal(matchesFilters(issue,f,now),false);
});
test("unknown latest commit metadata remains visible and is disclosed",()=>{
 const f=normalizeFilters({commitAfter:"2026-01-01"});
 const unknown={...issue,repository:{...issue.repository,latestCommitDate:null}};
 assert.equal(matchesFilters(unknown,f,now),true);
 assert.deepEqual(unknownFilterReasons(unknown,f),["latest commit date"]);
});
test("unknown repository push metadata remains visible and is disclosed",()=>{
 const f=normalizeFilters({pushAgeDays:"90"});
 const unknown={...issue,repository:{...issue.repository,pushed_at:undefined}};
 assert.equal(matchesFilters(unknown,f,now),true);
 assert.deepEqual(unknownFilterReasons(unknown,f),["repository last push date"]);
});
test("known category filter distinguishes a matching category from unrelated evidence",()=>{
 const bug=normalizeFilters({category:"Bug fix"});
 const docs=normalizeFilters({category:"Documentation"});
 assert.equal(matchesFilters({...issue,title:"Fix regression",body:"",labels:[]},bug,now),true);
 assert.equal(matchesFilters({...issue,title:"Fix regression",body:"",labels:[]},docs,now),false);
});
test("unknown language metadata is not silently treated as a mismatch",()=>{
 const f=normalizeFilters({language:"Rust"});
 const unknown={...issue,repository:{full_name:"demo/project",language:null}};
 assert.equal(matchesFilters(unknown,f,now),true);
 assert.deepEqual(unknownFilterReasons(unknown,f),["language metadata"]);
});

test("saved-search summaries are human readable instead of raw JSON",()=>{
 const f=normalizeFilters({query:"crash",language:"Rust",labels:["bug","help wanted"],issueType:"issue",category:"Bug fix",createdDays:"30",minStars:"100",maxStars:"999",sort:"comments"});
 const text=describeFilters(f);
 assert.match(text,/Search: crash/);
 assert.match(text,/Language: Rust/);
 assert.match(text,/Labels: bug, help wanted/);
 assert.match(text,/Issues only/);
 assert.match(text,/Category: Bug fix/);
 assert.match(text,/Created: last 30 days/);
 assert.match(text,/Stars: 100–999/);
 assert.match(text,/Sort: Most discussed/);
 assert.equal(text.includes("{"),false);
});

test("saved-search summaries name custom ranges and omit defaults",()=>{
 const custom=describeFilters(normalizeFilters({createdAfter:"2026-01-01",commitBefore:"2026-06-30",pushAgeDays:"90"}));
 assert.match(custom,/Created: 2026-01-01 to any/);
 assert.match(custom,/Latest commit: any to 2026-06-30/);
 assert.match(custom,/Repository push: within 90 days/);
 assert.equal(describeFilters(normalizeFilters({})),"No filters set");
 assert.equal(describeFilters(normalizeFilters({sort:"updated"})),"No filters set");
});

test("saved-search summaries surface star presets and pull-request choice",()=>{
 assert.match(describeFilters(normalizeFilters({stars:"100-999"})),/Stars: 100-999/);
 assert.match(describeFilters(normalizeFilters({issueType:"pr"})),/Pull requests only/);
});

