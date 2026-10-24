import {test,expect} from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("discover view exposes labelled filters and navigation",async({page})=>{await page.goto("/");await expect(page.getByRole("heading",{name:"Find work worth contributing to."})).toBeVisible();await expect(page.getByLabel("Language")).toBeVisible();await expect(page.getByRole("navigation",{name:"Main navigation"}).getByRole("link",{name:"Saved"})).toBeVisible();});
test("theme toggle changes appearance without clearing current filters",async({page})=>{
 await page.goto("/");
 const root=page.locator("html");
 const before=await root.getAttribute("data-theme");
 await page.locator("#query").fill("improve error handling");
 await page.locator("#language-picker").fill("TypeScript");
 await expect(page.locator("#language")).toHaveValue("TypeScript");
 await page.locator("#theme-toggle").click();
 await expect(root).not.toHaveAttribute("data-theme",before);
 await expect(page.locator("#query")).toHaveValue("improve error handling");
 await expect(page.locator("#language-picker")).toHaveValue("TypeScript");
 await page.locator("#theme-toggle").click();
 await expect(root).toHaveAttribute("data-theme",before);
});

test("saved page explains browser-local storage",async({page})=>{await page.goto("/#saved");await expect(page.getByRole("heading",{name:"Saved",exact:true})).toBeVisible();await expect(page.getByText(/Saved locally in this browser only/)).toBeVisible();});
test("about page documents evidence and API limits",async({page})=>{await page.goto("/#about");await expect(page.getByText(/does not label projects dead or calculate an overall health score/)).toBeVisible();await expect(page.getByText(/Unauthenticated API limits apply/)).toBeVisible();});

test("mocked GitHub flow searches, opens evidence, builds a sourced context pack and saves an issue",async({page})=>{
 const issue={html_url:"https://github.com/acme/demo/issues/1",title:"Fix crash on startup",body:"The app crashes on startup.",state:"open",number:1,created_at:"2026-01-20T00:00:00Z",updated_at:"2026-01-30T00:00:00Z",closed_at:null,comments:2,labels:[{name:"bug"}],repository_url:"https://api.github.com/repos/acme/demo"};
 const repo={full_name:"acme/demo",html_url:"https://github.com/acme/demo",language:"JavaScript",stargazers_count:150,pushed_at:"2026-01-29T00:00:00Z",default_branch:"main"};
 await page.route("https://api.github.com/**",async route=>{
  const u=new URL(route.request().url());
  if(u.pathname==="/search/issues"){if((u.searchParams.get("q")||"").includes("failure"))return route.fulfill({status:500,json:{message:"mocked failure"}});return route.fulfill({json:{total_count:1,incomplete_results:false,items:[issue]}});}
  if(u.pathname==="/repos/acme/demo/issues/1")return route.fulfill({json:issue});
  if(u.pathname==="/repos/acme/demo/readme")return route.fulfill({json:{html_url:"https://github.com/acme/demo/blob/main/README.md",encoding:"base64",content:"IyBEZW1vIFJFQURNRQ=="}});
  if(u.pathname==="/repos/acme/demo/commits")return route.fulfill({json:[{html_url:"https://github.com/acme/demo/commit/abc",commit:{committer:{date:"2026-01-29T00:00:00Z"}}}]});
  if(u.pathname==="/repos/acme/demo/contents")return route.fulfill({json:[
   {name:"app.js",path:"app.js",type:"file",html_url:"https://github.com/acme/demo/blob/main/app.js"},
   {name:"CONTRIBUTING.md",path:"CONTRIBUTING.md",type:"file",html_url:"https://github.com/acme/demo/blob/main/CONTRIBUTING.md"}
  ]});
  if(u.pathname==="/repos/acme/demo/contents/CONTRIBUTING.md")return route.fulfill({json:{html_url:"https://github.com/acme/demo/blob/main/CONTRIBUTING.md",encoding:"base64",content:"UGxlYXNlIGFkZCB0ZXN0cy4="}});
  if(u.pathname==="/repos/acme/demo")return route.fulfill({json:repo});
  return route.fulfill({status:404,json:{message:"not mocked"}});
 });
 await page.goto("/");
 await page.getByLabel("Search issues").fill("crash");
 await page.locator("details.advanced-filters summary").click();
 await page.getByLabel("Created on or after").fill("2026-01-01");
 await page.getByLabel("Repository last push on or after").fill("2026-01-01");
 await page.getByLabel("Minimum stars").fill("100");
 await page.getByRole("button",{name:"Search GitHub"}).click();
 await expect(page).toHaveURL(/ca=2026-01-01/);
 await expect(page).toHaveURL(/pa=2026-01-01/);
 await expect(page).toHaveURL(/minStars=100/);
 await page.reload();
 await expect(page.getByLabel("Created on or after")).toHaveValue("2026-01-01");
 await expect(page.getByLabel("Repository last push on or after")).toHaveValue("2026-01-01");
 await expect(page.getByRole("link",{name:"Fix crash on startup"})).toBeVisible();
 await page.getByRole("button",{name:"View details"}).focus();await page.keyboard.press("Enter");
 await expect(page.getByRole("heading",{name:"Fix crash on startup"})).toBeVisible();
 await expect(page.getByRole("heading",{name:"Official issue labels"})).toBeVisible();
 await expect(page.locator(".issue-label")).toHaveText(["bug"]);
 await expect(page.getByText(/Issue comments: 2/)).toBeVisible();
 await expect(page.getByText(/Issue data fetched/)).toBeVisible();
 await expect(page.getByText(/Last repository push/)).toBeVisible();
 await expect(page.getByRole("link",{name:"Search related issues"})).toHaveAttribute("href",/github\.com\/search/);
 await expect(page.getByRole("link",{name:"Search related pull requests"})).toHaveAttribute("href",/github\.com\/search/);
 const accessibility=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa"]).analyze();
 expect(accessibility.violations).toEqual([]);
 await page.getByRole("button",{name:"Generate context pack"}).focus();await page.keyboard.press("Enter");
 const pack=page.getByRole("textbox",{name:"Generated AI context pack"});
 await expect(pack).toHaveValue(/Please add tests\./);
 await expect(pack).toHaveValue(/app\.js: https:\/\/github\.com\/acme\/demo\/blob\/main\/app\.js/);
 await page.getByRole("button",{name:"Copy context pack"}).focus();await page.keyboard.press("Enter");await expect(page.locator("#status")).toContainText(/Context pack copied|Clipboard unavailable/);
 await page.getByRole("button",{name:"Save issue"}).focus();await page.keyboard.press("Enter");
 await page.getByRole("link",{name:"Saved",exact:true}).focus();await page.keyboard.press("Enter");
 await expect(page.getByRole("heading",{name:"Saved issues"})).toBeVisible();
 await expect(page.getByRole("link",{name:"Fix crash on startup"})).toBeVisible();
 await page.reload();
 await expect(page.getByRole("link",{name:"Fix crash on startup"})).toBeVisible();
 await page.getByRole("link",{name:"Discover",exact:true}).focus();await page.keyboard.press("Enter");
 await expect(page).toHaveURL(/#discover$/);
 await expect(page.getByRole("button",{name:"Save search"})).toBeVisible();
 await page.getByRole("button",{name:"Save search"}).focus();await page.keyboard.press("Enter");
 await expect(page.locator("#status")).toContainText("Search preset saved");
 await page.getByRole("link",{name:"Saved",exact:true}).focus();await page.keyboard.press("Enter");
 await expect(page.locator("#saved-searches .saved-search")).toHaveCount(1);
 await page.reload();
 await expect(page.locator("#saved-searches .saved-search")).toHaveCount(1);
 await page.getByRole("link",{name:"Discover",exact:true}).focus();await page.keyboard.press("Enter");
 await page.getByRole("button",{name:"Search GitHub"}).click();
 await expect(page.getByRole("link",{name:"Fix crash on startup"})).toBeVisible();
 await page.getByLabel("Search issues").fill("failure");
 await page.getByRole("button",{name:"Search GitHub"}).click();
 await expect(page.locator("#status")).toContainText("HTTP 500");
 await expect(page.getByLabel("Search issues")).toHaveValue("crash");
 await expect(page.getByRole("link",{name:"Fix crash on startup"})).toBeVisible();
});

test("invalid backup import preserves existing saved references",async({page})=>{
 await page.addInitScript(()=>localStorage.setItem("v36.saved.v1",JSON.stringify({version:1,exportedAt:"2026-01-01T00:00:00Z",issues:[{url:"https://github.com/acme/demo/issues/2",title:"Keep me",repository:"acme/demo",number:2}],searches:[]})));
 await page.goto("/#saved");
 await expect(page.getByRole("link",{name:"Keep me"})).toBeVisible();
 await page.locator("#import-file").setInputFiles({name:"bad.json",mimeType:"application/json",buffer:Buffer.from('{"version":2,"issues":[],"searches":[]}')});
 await expect(page.locator("#status")).toContainText("Import rejected");
 await expect(page.getByRole("link",{name:"Keep me"})).toBeVisible();
});

test("unknown commit metadata stays visible",async({page})=>{
 const issue={html_url:"https://github.com/acme/demo/issues/3",title:"Fix crash",body:"Crash",state:"open",number:3,created_at:"2026-01-20T00:00:00Z",updated_at:"2026-01-30T00:00:00Z",labels:[],repository_url:"https://api.github.com/repos/acme/demo"};
 await page.route("https://api.github.com/**",async route=>{const u=new URL(route.request().url());if(u.pathname==="/search/issues")return route.fulfill({json:{total_count:1,incomplete_results:false,items:[issue]}});if(u.pathname==="/repos/acme/demo")return route.fulfill({status:403,headers:{"x-ratelimit-remaining":"0","x-ratelimit-reset":"1900000000"},json:{message:"API rate limit exceeded"}});return route.fulfill({status:404,json:{message:"not mocked"}});});
 await page.goto("/");await page.locator("details.advanced-filters summary").click();await page.getByLabel("Latest commit on or after").fill("2026-01-01");await page.getByLabel("Search issues").fill("crash");await page.getByRole("button",{name:"Search GitHub"}).click();
 await expect(page.locator("#status")).toContainText("rate limit reached");await expect(page.getByRole("link",{name:"Fix crash"})).toBeVisible();await expect(page.getByText(/Could not evaluate selected filters: latest commit date/)).toBeVisible();await expect(page.locator("#results-meta")).toContainText("1 need metadata");
});

test("keyboard users can skip content, navigate, and submit a search",async({page})=>{
 await page.route("https://api.github.com/**",async route=>{const u=new URL(route.request().url());if(u.pathname==="/search/issues")return route.fulfill({json:{total_count:0,incomplete_results:false,items:[]}});return route.fulfill({status:404,json:{message:"not mocked"}});});
 await page.goto("/");
 await page.keyboard.press("Tab");
 await expect(page.locator(".skip-link")).toBeFocused();
 await page.keyboard.press("Enter");
 await expect(page.locator("#main")).toBeFocused();
 await page.getByRole("link",{name:"Saved",exact:true}).focus();
 await page.keyboard.press("Enter");
 await expect(page.getByRole("heading",{name:"Saved",exact:true})).toBeFocused();
 await page.getByRole("button",{name:"Import backup"}).focus();
 await expect(page.getByRole("button",{name:"Import backup"})).toBeFocused();
 await page.getByRole("link",{name:"Discover",exact:true}).focus();
 await page.keyboard.press("Enter");
 await expect(page.getByRole("heading",{name:"Find work worth contributing to."})).toBeFocused();
 await page.getByLabel("Search issues").fill("crash");
 await page.keyboard.press("Enter");
 await expect(page.locator("#status")).toContainText("Loaded 0 issues");
});
test("valid import reports accepted, rejected and duplicate items",async({page})=>{
 await page.goto("/#saved");
 const issue={url:"https://github.com/acme/demo/issues/5",title:"Imported issue",repository:"acme/demo",number:5};
 const data={version:1,exportedAt:"2026-01-01T00:00:00Z",issues:[issue,{...issue},{url:"javascript:alert(1)"}],searches:[]};
 await page.locator("#import-file").setInputFiles({name:"backup.json",mimeType:"application/json",buffer:Buffer.from(JSON.stringify(data))});
 await expect(page.locator("#status")).toContainText("1 valid item accepted, 1 invalid item rejected, 1 duplicate merged");
 await expect(page.getByRole("link",{name:"Imported issue"})).toBeVisible();
});
test("export downloads a versioned saved-data backup",async({page})=>{
 await page.goto("/#saved");
 const downloadPromise=page.waitForEvent("download");
 await page.getByRole("button",{name:"Export backup"}).focus();await page.keyboard.press("Enter");
 const download=await downloadPromise;
 expect(download.suggestedFilename()).toBe("v36-backup.json");
});
test("storage write failures are reported and saved references remain visible",async({page})=>{
 await page.addInitScript(()=>{
  localStorage.setItem("v36.saved.v1",JSON.stringify({version:1,exportedAt:"2026-01-01T00:00:00Z",issues:[{url:"https://github.com/acme/demo/issues/7",title:"Keep this",repository:"acme/demo",number:7}],searches:[]}));
  const original=Storage.prototype.setItem;
  Storage.prototype.setItem=function(key,value){if(key==="v36.saved.v1")throw new DOMException("Quota exceeded","QuotaExceededError");return original.call(this,key,value);};
 });
 await page.goto("/#saved");
 await page.getByRole("button",{name:"Remove saved reference"}).click();
 await expect(page.locator("#status")).toContainText("Could not update browser storage");
 await expect(page.getByRole("link",{name:"Keep this"})).toBeVisible();
});

test("incomplete GitHub results remain pageable and load-more appends results",async({page})=>{
 const issue=n=>({html_url:"https://github.com/acme/demo/issues/"+n,title:"Issue "+n,body:"demo issue",state:"open",number:n,created_at:"2026-01-20T00:00:00Z",updated_at:"2026-01-30T00:00:00Z",labels:[],repository_url:"https://api.github.com/repos/acme/demo"});
 const repo={full_name:"acme/demo",html_url:"https://github.com/acme/demo",language:"JavaScript",stargazers_count:150,pushed_at:"2026-01-29T00:00:00Z"};
 await page.route("https://api.github.com/**",async route=>{const u=new URL(route.request().url());if(u.pathname==="/search/issues"){const p=Number(u.searchParams.get("page")||"1");return route.fulfill({json:{total_count:21,incomplete_results:p===1,items:p===1?Array.from({length:20},(_,i)=>issue(i+1)):[issue(21)]}});}if(u.pathname==="/repos/acme/demo")return route.fulfill({json:repo});return route.fulfill({status:404,json:{message:"not mocked"}});});
 await page.goto("/");await page.getByLabel("Search issues").fill("demo");await page.getByRole("button",{name:"Search GitHub"}).click();
 await expect(page.locator("#status")).toContainText("search incomplete");await expect(page.locator("#results .issue-card")).toHaveCount(20);await expect(page.getByRole("button",{name:/Load more/})).toBeVisible();
 await page.getByRole("button",{name:/Load more/}).click();await expect(page.getByRole("link",{name:"Issue 21"})).toBeVisible();await expect(page.locator("#results .issue-card")).toHaveCount(21);await expect(page.getByRole("button",{name:/Load more/})).toBeHidden();
});
test("untrusted issue markup is rendered as text rather than executable HTML",async({page})=>{
 const body='<img src=x onerror="window.__v36Xss=true">';
 const issue={html_url:"https://github.com/acme/demo/issues/9",title:"Unsafe HTML",body,state:"open",number:9,created_at:"2026-01-20T00:00:00Z",updated_at:"2026-01-30T00:00:00Z",labels:[],repository_url:"https://api.github.com/repos/acme/demo"};
 const repo={full_name:"acme/demo",html_url:"https://github.com/acme/demo",language:"JavaScript",stargazers_count:150,pushed_at:"2026-01-29T00:00:00Z"};
 await page.route("https://api.github.com/**",async route=>{const u=new URL(route.request().url());if(u.pathname==="/search/issues")return route.fulfill({json:{total_count:1,incomplete_results:false,items:[issue]}});if(u.pathname==="/repos/acme/demo/issues/9")return route.fulfill({json:issue});if(u.pathname==="/repos/acme/demo/readme")return route.fulfill({json:{html_url:"https://github.com/acme/demo/blob/main/README.md",encoding:"base64",content:"IyBSRUFETUU="}});if(u.pathname==="/repos/acme/demo/commits")return route.fulfill({json:[]});if(u.pathname==="/repos/acme/demo")return route.fulfill({json:repo});return route.fulfill({status:404,json:{message:"not mocked"}});});
 await page.goto("/");await page.getByLabel("Search issues").fill("unsafe");await page.getByRole("button",{name:"Search GitHub"}).click();await page.getByRole("button",{name:"View details"}).focus();await page.keyboard.press("Enter");
 await expect(page.locator(".issue-body")).toHaveText(body);await expect(page.locator(".issue-body img")).toHaveCount(0);expect(await page.evaluate(()=>window.__v36Xss)).toBeUndefined();
});

test("saved route keeps its hash when a shareable query is present",async({page})=>{
 let searchRequests=0;
 await page.route("https://api.github.com/search/issues**",async route=>{searchRequests++;return route.fulfill({json:{total_count:0,incomplete_results:false,items:[]}});});
 await page.goto("/?q=crash#saved");
 await expect(page.getByRole("heading",{name:"Saved",exact:true})).toBeVisible();
 await expect(page).toHaveURL(/#saved$/);
 expect(searchRequests).toBe(0);
 await page.getByRole("link",{name:"Discover",exact:true}).click();
 await expect(page).toHaveURL(/#discover$/);
 await expect(page.getByRole("button",{name:"Save search"})).toBeVisible();
});

test("unreadable saved storage is never overwritten by import or export",async({page})=>{
 const corrupted="{not valid json";
 await page.addInitScript(value=>localStorage.setItem("v36.saved.v1",value),corrupted);
 await page.goto("/#saved");
 await expect(page.locator("#status")).toContainText("Saved data could not be read");
 await page.getByRole("button",{name:"Import backup"}).click();
 const valid=JSON.stringify({version:1,issues:[{url:"https://github.com/acme/demo/issues/5",title:"Imported"}],searches:[]});
 await page.locator("#import-file").setInputFiles({name:"valid.json",mimeType:"application/json",buffer:Buffer.from(valid)});
 await expect(page.locator("#status")).toContainText("saving, importing, removing, and exporting are disabled");
 await expect.poll(()=>page.evaluate(()=>localStorage.getItem("v36.saved.v1"))).toBe(corrupted);
 await page.getByRole("button",{name:"Export backup"}).click();
 await expect(page.locator("#status")).toContainText("saving, importing, removing, and exporting are disabled");
 await expect.poll(()=>page.evaluate(()=>localStorage.getItem("v36.saved.v1"))).toBe(corrupted);
});

test("shareable URL round-trips the standard filter set",async({page})=>{
 await page.route("https://api.github.com/**",async route=>{const u=new URL(route.request().url());if(u.pathname==="/search/issues")return route.fulfill({json:{total_count:0,incomplete_results:false,items:[]}});return route.fulfill({status:404,json:{message:"not mocked"}});});
 await page.goto("/");
 await page.getByLabel("Search issues").fill("memory leak");
 await page.getByLabel("Language").fill("Rust");
 await page.locator("#labels-picker > summary").click();
 await page.getByRole("searchbox",{name:"Search available labels"}).fill("good first issue");
 await page.getByLabel("good first issue").check();
 await page.getByRole("searchbox",{name:"Search available labels"}).fill("help wanted");
 await page.getByLabel("help wanted").check();
 await expect(page.locator("#labels")).toHaveValue("good first issue,help wanted");
 await page.locator(".advanced-filters > summary").click();
 await page.locator("#issue-type").selectOption("issue");
 await page.locator("#category").selectOption("Documentation");
 await page.locator("#created").selectOption("30");
 await page.locator("#updated").selectOption("7");
 await page.locator("#commit-age").selectOption("90");
 await page.locator("#push-age").selectOption("180");
 await page.locator("#stars").selectOption("100-999");
 await page.locator("#sort").selectOption("comments");
 await page.getByRole("button",{name:"Search GitHub"}).click();
 await expect(page).toHaveURL(/q=memory\+leak/);
 await expect(page).toHaveURL(/lang=Rust/);
 await expect(page).toHaveURL(/labels=good\+first\+issue%2Chelp\+wanted/);
 await expect(page).toHaveURL(/type=issue/);
 await expect(page).toHaveURL(/category=Documentation/);
 await expect(page).toHaveURL(/created=30/);
 await expect(page).toHaveURL(/updated=7/);
 await expect(page).toHaveURL(/commit=90/);
 await expect(page).toHaveURL(/push=180/);
 await expect(page).toHaveURL(/stars=100-999/);
 await expect(page).toHaveURL(/sort=comments/);
 await page.reload();
 await expect(page.getByLabel("Search issues")).toHaveValue("memory leak");
 await expect(page.getByLabel("Language")).toHaveValue("Rust");
 await expect(page.getByLabel("Labels (comma-separated)")).toHaveValue("good first issue, help wanted");
 await expect(page.locator("#issue-type")).toHaveValue("issue");
 await expect(page.locator("#category")).toHaveValue("Documentation");
 await expect(page.locator("#created")).toHaveValue("30");
 await expect(page.locator("#updated")).toHaveValue("7");
 await expect(page.locator("#commit-age")).toHaveValue("90");
 await expect(page.locator("#push-age")).toHaveValue("180");
 await expect(page.locator("#stars")).toHaveValue("100-999");
 await expect(page.locator("#sort")).toHaveValue("comments");
});
test("shareable URL round-trips custom date bounds and exact star limits",async({page})=>{
 await page.route("https://api.github.com/**",async route=>{const u=new URL(route.request().url());if(u.pathname==="/search/issues")return route.fulfill({json:{total_count:0,incomplete_results:false,items:[]}});return route.fulfill({status:404,json:{message:"not mocked"}});});
 await page.goto("/");
 await page.getByLabel("Search issues").fill("parser");
 await page.locator("details.advanced-filters summary").click();
 const values={"Created on or after":"2026-01-01","Created on or before":"2026-02-01","Updated on or after":"2026-01-02","Updated on or before":"2026-02-02","Latest commit on or after":"2026-01-03","Latest commit on or before":"2026-02-03","Repository last push on or after":"2026-01-04","Repository last push on or before":"2026-02-04","Minimum stars":"120","Maximum stars":"500"};
 for(const [label,value] of Object.entries(values))await page.getByLabel(label).fill(value);
 await page.getByRole("button",{name:"Search GitHub"}).click();
 for(const key of ["ca=2026-01-01","cb=2026-02-01","ua=2026-01-02","ub=2026-02-02","ma=2026-01-03","mb=2026-02-03","pa=2026-01-04","pb=2026-02-04","minStars=120","maxStars=500"])await expect(page).toHaveURL(new RegExp(key));
 await expect(page).not.toHaveURL(/(?:^|[?&])(?:created|updated|commit|push|stars)=/);
 await page.reload();
 for(const [label,value] of Object.entries(values))await expect(page.getByLabel(label)).toHaveValue(value);
 await expect(page.locator("details.advanced-filters")).toHaveAttribute("open","");
});
test("issue details preserve the reference and disclose when GitHub returns 404",async({page})=>{
 const issue={html_url:"https://github.com/acme/demo/issues/11",title:"Issue moved or unavailable",body:"Original issue description",state:"open",number:11,created_at:"2026-01-20T00:00:00Z",updated_at:"2026-01-30T00:00:00Z",labels:[],repository_url:"https://api.github.com/repos/acme/demo"};
 await page.route("https://api.github.com/**",async route=>{const u=new URL(route.request().url());if(u.pathname==="/search/issues")return route.fulfill({json:{total_count:1,incomplete_results:false,items:[issue]}});return route.fulfill({status:404,json:{message:"Not Found"}});});
 await page.goto("/");
 await page.getByLabel("Search issues").fill("unavailable");
 await page.getByRole("button",{name:"Search GitHub"}).click();
 await page.getByRole("button",{name:"Save issue"}).click();
 await page.getByRole("button",{name:"View details"}).click();
 await expect(page.getByRole("heading",{name:"Issue moved or unavailable"})).toBeVisible();
 await expect(page.locator(".issue-body")).toHaveText("Original issue description");
 await expect(page.getByRole("heading",{name:"Unavailable data"})).toBeVisible();
 await expect(page.getByText(/Issue refresh: GitHub could not find this resource/)).toBeVisible();
 await expect(page.getByText(/Repository metadata: GitHub could not find this resource/)).toBeVisible();
 await page.getByRole("link",{name:"Saved",exact:true}).click();
 await expect(page.getByRole("link",{name:"Issue moved or unavailable"})).toBeVisible();
 await expect(page.getByText(/Current status has not been checked/)).toBeVisible();
});

test("issue detail activity can be retried after a rate-limited repository refresh",async({page})=>{
 const issue={html_url:"https://github.com/acme/demo/issues/12",title:"Retry activity evidence",body:"Evidence can be refreshed.",state:"open",number:12,created_at:"2026-01-20T00:00:00Z",updated_at:"2026-01-30T00:00:00Z",labels:[],repository_url:"https://api.github.com/repos/acme/demo"};
 const repo={full_name:"acme/demo",html_url:"https://github.com/acme/demo",language:"JavaScript",stargazers_count:150,pushed_at:"2026-01-29T00:00:00Z"};
 let repoCalls=0,readmeCalls=0,commitCalls=0;
 await page.route("https://api.github.com/**",async route=>{
  const u=new URL(route.request().url());
  if(u.pathname==="/search/issues")return route.fulfill({json:{total_count:1,incomplete_results:false,items:[issue]}});
  if(u.pathname==="/repos/acme/demo/issues/12")return route.fulfill({json:issue});
  if(u.pathname==="/repos/acme/demo"){repoCalls++;if(repoCalls===2)return route.fulfill({status:403,headers:{"x-ratelimit-remaining":"0","retry-after":"30","access-control-expose-headers":"x-ratelimit-remaining, retry-after"},json:{message:"API rate limit exceeded"}});return route.fulfill({json:repo});}
  if(u.pathname==="/repos/acme/demo/readme"){readmeCalls++;return route.fulfill({json:{html_url:"https://github.com/acme/demo/blob/main/README.md",encoding:"base64",content:"IyBEZW1v"}});}
  if(u.pathname==="/repos/acme/demo/commits"){commitCalls++;return route.fulfill({json:[]});}
  return route.fulfill({status:404,json:{message:"not mocked"}});
 });
 await page.goto("/");
 await page.getByLabel("Search issues").fill("retry");
 await page.getByRole("button",{name:"Search GitHub"}).click();
 await page.getByRole("button",{name:"View details"}).click();
 await expect(page.getByRole("heading",{name:"Unavailable data"})).toBeVisible();
 await expect(page.getByText(/Repository metadata: GitHub API rate limit reached/)).toBeVisible();
 await expect(page.getByText(/Retry after/)).toBeVisible();
 expect(readmeCalls).toBe(0);expect(commitCalls).toBe(0);
 await page.getByRole("button",{name:"Retry activity refresh"}).click();
 await expect(page.getByText("Stars (popularity only): 150")).toBeVisible();
 expect(repoCalls).toBe(3);expect(readmeCalls).toBe(1);expect(commitCalls).toBe(1);
});

test("language filter includes secondary repository languages from GitHub metadata",async({page})=>{
 const issue={html_url:"https://github.com/acme/demo/issues/21",title:"Support Rust build",body:"Rust support",state:"open",number:21,created_at:"2026-01-20T00:00:00Z",updated_at:"2026-01-30T00:00:00Z",labels:[],repository_url:"https://api.github.com/repos/acme/demo"};
 const repo={full_name:"acme/demo",html_url:"https://github.com/acme/demo",language:"JavaScript",stargazers_count:150,pushed_at:"2026-01-29T00:00:00Z"};
 await page.route("https://api.github.com/**",async route=>{const u=new URL(route.request().url());if(u.pathname==="/search/issues")return route.fulfill({json:{total_count:1,incomplete_results:false,items:[issue]}});if(u.pathname==="/repos/acme/demo")return route.fulfill({json:repo});if(u.pathname==="/repos/acme/demo/languages")return route.fulfill({json:{JavaScript:1000,Rust:500}});return route.fulfill({status:404,json:{message:"not mocked"}});});
 await page.goto("/");
 await page.getByLabel("Language").fill("Rust");
 await page.getByLabel("Search issues").fill("Rust");
 await page.getByRole("button",{name:"Search GitHub"}).click();
 await expect(page.getByRole("link",{name:"Support Rust build"})).toBeVisible();
 await expect(page.locator("#results-meta")).toContainText("1 fully evaluated");
});
test("language metadata failure keeps a result visible and marks the filter uncertain",async({page})=>{
 const issue={html_url:"https://github.com/acme/demo/issues/22",title:"Rust build support",body:"Rust support",state:"open",number:22,created_at:"2026-01-20T00:00:00Z",updated_at:"2026-01-30T00:00:00Z",labels:[],repository_url:"https://api.github.com/repos/acme/demo"};
 const repo={full_name:"acme/demo",html_url:"https://github.com/acme/demo",language:"JavaScript",stargazers_count:150,pushed_at:"2026-01-29T00:00:00Z"};
 await page.route("https://api.github.com/**",async route=>{const u=new URL(route.request().url());if(u.pathname==="/search/issues")return route.fulfill({json:{total_count:1,incomplete_results:false,items:[issue]}});if(u.pathname==="/repos/acme/demo")return route.fulfill({json:repo});if(u.pathname==="/repos/acme/demo/languages")return route.fulfill({status:404,json:{message:"Not Found"}});return route.fulfill({status:404,json:{message:"not mocked"}});});
 await page.goto("/");
 await page.getByLabel("Language").fill("Rust");
 await page.getByLabel("Search issues").fill("Rust");
 await page.getByRole("button",{name:"Search GitHub"}).click();
 await expect(page.getByRole("link",{name:"Rust build support"})).toBeVisible();
 await expect(page.getByText(/Could not evaluate selected filters: language metadata/)).toBeVisible();
});
test("shareable search URLs never contain saved references or credential-like data",async({page})=>{
 await page.addInitScript(()=>localStorage.setItem("v36.saved.v1",JSON.stringify({version:1,exportedAt:"2026-01-01T00:00:00Z",issues:[{url:"https://github.com/acme/demo/issues/99",title:"PRIVATE_SAVED_MARKER",repository:"acme/demo",number:99}],searches:[]})));
 await page.route("https://api.github.com/**",async route=>{const u=new URL(route.request().url());if(u.pathname==="/search/issues")return route.fulfill({json:{total_count:0,incomplete_results:false,items:[]}});return route.fulfill({status:404,json:{message:"not mocked"}});});
 await page.goto("/");
 await page.getByLabel("Search issues").fill("public bug");
 await page.getByRole("button",{name:"Search GitHub"}).click();
 expect(page.url()).not.toContain("PRIVATE_SAVED_MARKER");
 expect(page.url()).not.toMatch(/[?&](?:token|access_token|authorization)=/i);
 await expect(page).toHaveURL(/q=public\+bug/);
});

test("fresh detail response reflects a closed issue without losing the saved reference",async({page})=>{
 const searchIssue={html_url:"https://github.com/acme/demo/issues/31",title:"Example issue",body:"Old search snapshot",state:"open",number:31,created_at:"2026-01-20T00:00:00Z",updated_at:"2026-01-30T00:00:00Z",labels:[{name:"bug"}],repository_url:"https://api.github.com/repos/acme/demo"};
 const freshIssue={...searchIssue,body:"Latest closed issue body",state:"closed",closed_at:"2026-10-20T12:00:00Z",updated_at:"2026-10-20T12:00:00Z",labels:[{name:"bug"},{name:"fixed"}]};
 const repo={full_name:"acme/demo",html_url:"https://github.com/acme/demo",language:"JavaScript",stargazers_count:150,pushed_at:"2026-10-20T12:00:00Z"};
 await page.route("https://api.github.com/**",async route=>{const u=new URL(route.request().url());if(u.pathname==="/search/issues")return route.fulfill({json:{total_count:1,incomplete_results:false,items:[searchIssue]}});if(u.pathname==="/repos/acme/demo/issues/31")return route.fulfill({json:freshIssue});if(u.pathname==="/repos/acme/demo")return route.fulfill({json:repo});if(u.pathname==="/repos/acme/demo/readme")return route.fulfill({json:{html_url:"https://github.com/acme/demo/blob/main/README.md",encoding:"base64",content:"IyBEZW1v"}});if(u.pathname==="/repos/acme/demo/commits")return route.fulfill({json:[]});return route.fulfill({status:404,json:{message:"not mocked"}});});
 await page.goto("/");
 await page.getByLabel("Search issues").fill("example");
 await page.getByRole("button",{name:"Search GitHub"}).click();
 await page.getByRole("button",{name:"Save issue"}).click();
 await page.getByRole("button",{name:"View details"}).click();
 await expect(page.getByText("Latest closed issue body")).toBeVisible();
 await expect(page.getByText("Issue state: closed")).toBeVisible();
 await expect(page.getByText(/Closed at: /)).toBeVisible();
 await expect(page.locator(".issue-label")).toHaveText(["bug","fixed"]);
 await page.getByRole("link",{name:"Saved",exact:true}).click();
 await expect(page.getByRole("link",{name:"Example issue"})).toBeVisible();
 await expect(page.getByText(/Current status has not been checked/)).toBeVisible();
});

test("result counts and detail outcomes are announced through live regions",async({page})=>{
 const issue={html_url:"https://github.com/acme/demo/issues/3",title:"Announce this issue",body:"Body",state:"open",number:3,created_at:"2026-01-20T00:00:00Z",updated_at:"2026-01-30T00:00:00Z",closed_at:null,comments:0,labels:[],repository_url:"https://api.github.com/repos/acme/demo"};
 const repo={full_name:"acme/demo",html_url:"https://github.com/acme/demo",language:"JavaScript",stargazers_count:12,pushed_at:"2026-01-29T00:00:00Z",default_branch:"main"};
 await page.route("https://api.github.com/**",async route=>{const u=new URL(route.request().url());
  if(u.pathname==="/search/issues")return route.fulfill({json:{total_count:1,incomplete_results:false,items:[issue]}});
  if(u.pathname==="/repos/acme/demo/issues/3")return route.fulfill({json:issue});
  if(u.pathname==="/repos/acme/demo/readme")return route.fulfill({json:{html_url:"https://github.com/acme/demo/blob/main/README.md",encoding:"base64",content:"IyBEZW1vIFJFQURNRQ=="}});
  if(u.pathname==="/repos/acme/demo/commits")return route.fulfill({json:[{html_url:"https://github.com/acme/demo/commit/abc",commit:{committer:{date:"2026-01-29T00:00:00Z"}}}]});
  if(u.pathname==="/repos/acme/demo")return route.fulfill({json:repo});
  return route.fulfill({status:404,json:{message:"not mocked"}});
 });
 await page.goto("/");
 await page.getByLabel("Search issues").fill("announce");
 await page.getByRole("button",{name:"Search GitHub"}).click();
 const meta=page.locator("#results-meta");
 await expect(meta).toHaveAttribute("role","status");
 await expect(meta).toHaveAttribute("aria-live","polite");
 await expect(meta).toHaveAttribute("aria-atomic","true");
 await expect(meta).toContainText("Showing 1 loaded results");
 await expect(page.locator("#status")).toHaveAttribute("aria-live","polite");
 await page.getByRole("button",{name:"View details"}).click();
 await expect(page.locator("#status")).toHaveAttribute("aria-live","polite");
 await expect(page.locator("#status")).toContainText("Issue details refreshed from GitHub");
});

test("failed searches are announced assertively and preserve prior results",async({page})=>{
 const issue={html_url:"https://github.com/acme/demo/issues/4",title:"Keep me visible",body:"Body",state:"open",number:4,created_at:"2026-01-20T00:00:00Z",updated_at:"2026-01-30T00:00:00Z",closed_at:null,comments:0,labels:[],repository_url:"https://api.github.com/repos/acme/demo"};
 const repo={full_name:"acme/demo",html_url:"https://github.com/acme/demo",language:"JavaScript",stargazers_count:5,pushed_at:"2026-01-29T00:00:00Z",default_branch:"main"};
 await page.route("https://api.github.com/**",async route=>{const u=new URL(route.request().url());
  if(u.pathname==="/search/issues"){if((u.searchParams.get("q")||"").includes("breakdown"))return route.fulfill({status:500,json:{message:"mocked failure"}});return route.fulfill({json:{total_count:1,incomplete_results:false,items:[issue]}});}
  if(u.pathname==="/repos/acme/demo")return route.fulfill({json:repo});
  return route.fulfill({status:404,json:{message:"not mocked"}});
 });
 await page.goto("/");
 await page.getByLabel("Search issues").fill("keep");
 await page.getByRole("button",{name:"Search GitHub"}).click();
 await expect(page.getByRole("link",{name:"Keep me visible"})).toBeVisible();
 await expect(page.locator("#status")).toHaveAttribute("aria-live","polite");
 await page.getByLabel("Search issues").fill("breakdown");
 await page.getByRole("button",{name:"Search GitHub"}).click();
 await expect(page.locator("#status")).toHaveAttribute("aria-live","assertive");
 await expect(page.locator("#status")).toContainText("HTTP 500");
 await expect(page.getByRole("link",{name:"Keep me visible"})).toBeVisible();
 await expect(page.locator("#results-meta")).toContainText("Showing 1 loaded results");
});



test("results region reports busy state while a search is pending",async({page})=>{
 let release;const gate=new Promise(resolve=>{release=resolve;});
 await page.route("https://api.github.com/**",async route=>{const u=new URL(route.request().url());
  if(u.pathname==="/search/issues"){await gate;return route.fulfill({json:{total_count:0,incomplete_results:false,items:[]}});}
  return route.fulfill({status:404,json:{message:"not mocked"}});
 });
 await page.goto("/");
 await page.getByLabel("Search issues").fill("pending");
 await page.getByRole("button",{name:"Search GitHub"}).click();
 await expect(page.locator("#results")).toHaveAttribute("aria-busy","true");
 release();
 await expect(page.locator("#results")).toHaveAttribute("aria-busy","false");
 await expect(page.locator("#status")).toContainText("Loaded 0 issues");
});

test("detail refresh progress is announced before the refreshed evidence",async({page})=>{
 const issue={html_url:"https://github.com/acme/demo/issues/5",title:"Slow detail issue",body:"Body",state:"open",number:5,created_at:"2026-01-20T00:00:00Z",updated_at:"2026-01-30T00:00:00Z",closed_at:null,comments:0,labels:[],repository_url:"https://api.github.com/repos/acme/demo"};
 const repo={full_name:"acme/demo",html_url:"https://github.com/acme/demo",language:"JavaScript",stargazers_count:7,pushed_at:"2026-01-29T00:00:00Z",default_branch:"main"};
 let release;const gate=new Promise(resolve=>{release=resolve;});
 await page.route("https://api.github.com/**",async route=>{const u=new URL(route.request().url());
  if(u.pathname==="/search/issues")return route.fulfill({json:{total_count:1,incomplete_results:false,items:[issue]}});
  if(u.pathname==="/repos/acme/demo/issues/5"){await gate;return route.fulfill({json:issue});}
  if(u.pathname==="/repos/acme/demo/readme")return route.fulfill({json:{html_url:"https://github.com/acme/demo/blob/main/README.md",encoding:"base64",content:"IyBEZW1vIFJFQURNRQ=="}});
  if(u.pathname==="/repos/acme/demo/commits")return route.fulfill({json:[{html_url:"https://github.com/acme/demo/commit/abc",commit:{committer:{date:"2026-01-29T00:00:00Z"}}}]});
  if(u.pathname==="/repos/acme/demo")return route.fulfill({json:repo});
  return route.fulfill({status:404,json:{message:"not mocked"}});
 });
 await page.goto("/");
 await page.getByLabel("Search issues").fill("slow");
 await page.getByRole("button",{name:"Search GitHub"}).click();
 await page.getByRole("button",{name:"View details"}).click();
 await expect(page.locator("#detail-content").getByRole("status")).toContainText("Refreshing issue and repository evidence");
 release();
 await expect(page.locator("#status")).toContainText("Issue details refreshed from GitHub");
});

test("saved searches wrap long summaries without pushing actions out of the card",async({page})=>{
 await page.setViewportSize({width:320,height:800});
 await page.goto("/");
 await page.getByLabel("Search issues").fill("a".repeat(200));
 await page.getByLabel("Labels (comma-separated)").fill(Array.from({length:6},(_,i)=>"verylonglabelname"+i).join(","));
 await page.getByRole("button",{name:"Save search"}).click();
 await page.getByRole("link",{name:"Saved",exact:true}).click();
 const row=page.locator("#saved-searches .saved-search").first();
 await expect(row).toBeVisible();
 await expect(row).toContainText("Search: "+"a".repeat(20));
 await expect(row).toContainText("Labels: verylonglabelname0");
 await expect(row).not.toContainText('{"query"');
 const layout=await row.evaluate(el=>{
  const r=el.getBoundingClientRect(),buttons=[...el.querySelectorAll("button")].map(b=>b.getBoundingClientRect());
  return {rowOverflow:el.scrollWidth-el.clientWidth,contained:buttons.every(b=>b.left>=r.left-0.5&&b.right<=r.right+0.5&&b.top>=r.top-0.5&&b.bottom<=r.bottom+0.5),count:buttons.length};
 });
 expect(layout.count).toBe(2);
 expect(layout.contained).toBe(true);
 expect(layout.rowOverflow).toBeLessThanOrEqual(1);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});

test("star inputs ignore spaces instead of blocking form submission",async({page})=>{
 await page.route("https://api.github.com/**",route=>route.fulfill({json:{total_count:0,incomplete_results:false,items:[]}}));
 await page.goto("/");
 await page.locator("details.advanced-filters summary").click();
 const min=page.getByLabel("Minimum stars");
 await min.click();
 await min.pressSequentially(" 100");
 await expect(min).toHaveValue("100");
 await page.getByLabel("Maximum stars").click();
 await page.getByLabel("Maximum stars").pressSequentially(" 900");
 await expect(page.getByLabel("Maximum stars")).toHaveValue("900");
 await page.getByRole("button",{name:"Search GitHub"}).click();
 await expect(page.locator("#status")).toContainText("Loaded 0 issues");
});


test("related work links keep the issue repository when repository metadata is unavailable",async({page})=>{
 const issue={html_url:"https://github.com/acme/demo/issues/9",title:"Fix crash",body:"Body",state:"open",number:9,created_at:"2026-01-20T00:00:00Z",updated_at:"2026-01-30T00:00:00Z",closed_at:null,comments:0,labels:[],repository_url:"https://api.github.com/repos/acme/demo"};
 await page.route("https://api.github.com/**",route=>{const u=new URL(route.request().url());
  if(u.pathname==="/search/issues")return route.fulfill({json:{total_count:1,incomplete_results:false,items:[issue]}});
  if(u.pathname==="/repos/acme/demo/issues/9")return route.fulfill({json:issue});
  if(u.pathname==="/repos/acme/demo")return route.fulfill({status:403,headers:{"x-ratelimit-remaining":"0","x-ratelimit-reset":"1893456000"},json:{message:"API rate limit exceeded"}});
  return route.fulfill({status:404,json:{message:"not mocked"}});
 });
 await page.goto("/");
 await page.getByLabel("Search issues").fill("crash");
 await page.getByRole("button",{name:"Search GitHub"}).click();
 await page.getByRole("button",{name:"View details"}).click();
 await expect(page.getByRole("heading",{name:"Fix crash"})).toBeVisible();
 const issueHref=await page.getByRole("link",{name:"Search related issues"}).getAttribute("href");
 const prHref=await page.getByRole("link",{name:"Search related pull requests"}).getAttribute("href");
 expect(issueHref).not.toContain("undefined");
 expect(prHref).not.toContain("undefined");
 const issueUrl=new URL(issueHref),prUrl=new URL(prHref);
 expect(issueUrl.searchParams.get("q")).toBe("repo:acme/demo Fix crash");
 expect(issueUrl.searchParams.get("type")).toBe("issues");
 expect(prUrl.searchParams.get("q")).toBe("repo:acme/demo Fix crash");
 expect(prUrl.searchParams.get("type")).toBe("pullrequests");
 await page.getByRole("button",{name:"Generate context pack"}).click();
 const pack=await page.getByRole("textbox",{name:"Generated AI context pack"}).inputValue();
 expect(pack).toContain("Evidence completeness");
 expect(pack).toContain("INCOMPLETE");
 expect(pack).toContain("Name: acme/demo (identity from the issue URL; repository metadata was not retrieved)");
 expect(pack).toContain("Not retrieved:");
 expect(pack).not.toContain("undefined");
 expect(pack).not.toContain("Retry after");
});

