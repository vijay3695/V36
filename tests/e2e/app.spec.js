import {test,expect} from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("discover view exposes labelled filters and navigation",async({page})=>{await page.goto("/");await expect(page.getByRole("heading",{name:"Find work worth contributing to."})).toBeVisible();await expect(page.getByLabel("Language")).toBeVisible();await expect(page.getByRole("navigation",{name:"Main navigation"}).getByRole("link",{name:"Saved"})).toBeVisible();});
test("saved page explains browser-local storage",async({page})=>{await page.goto("/#saved");await expect(page.getByRole("heading",{name:"Saved",exact:true})).toBeVisible();await expect(page.getByText(/Saved locally in this browser only/)).toBeVisible();});
test("about page documents evidence and API limits",async({page})=>{await page.goto("/#about");await expect(page.getByText(/does not label projects dead or calculate an overall health score/)).toBeVisible();await expect(page.getByText(/Unauthenticated API limits apply/)).toBeVisible();});

test("mocked GitHub flow searches, opens evidence, builds a sourced context pack and saves an issue",async({page})=>{
 const issue={html_url:"https://github.com/acme/demo/issues/1",title:"Fix crash on startup",body:"The app crashes on startup.",state:"open",number:1,created_at:"2026-01-20T00:00:00Z",updated_at:"2026-01-30T00:00:00Z",closed_at:null,comments:2,labels:[{name:"bug"}],repository_url:"https://api.github.com/repos/acme/demo"};
 const repo={full_name:"acme/demo",html_url:"https://github.com/acme/demo",language:"JavaScript",stargazers_count:150,pushed_at:"2026-01-29T00:00:00Z",default_branch:"main"};
 await page.route("https://api.github.com/**",async route=>{
  const u=new URL(route.request().url());
  if(u.pathname==="/search/issues")return route.fulfill({json:{total_count:1,incomplete_results:false,items:[issue]}});
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
 await page.getByLabel("Minimum stars").fill("100");
 await page.getByRole("button",{name:"Search GitHub"}).click();
 await expect(page).toHaveURL(/ca=2026-01-01/);
 await expect(page).toHaveURL(/minStars=100/);
 await page.reload();
 await expect(page.getByLabel("Created on or after")).toHaveValue("2026-01-01");
 await expect(page.getByRole("link",{name:"Fix crash on startup"})).toBeVisible();
 await page.getByRole("button",{name:"View details"}).click();
 await expect(page.getByRole("heading",{name:"Fix crash on startup"})).toBeVisible();
 await expect(page.getByText(/Last repository push/)).toBeVisible();
 const accessibility=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa"]).analyze();
 expect(accessibility.violations).toEqual([]);
 await page.getByRole("button",{name:"Generate context pack"}).click();
 const pack=page.getByRole("textbox",{name:"Generated AI context pack"});
 await expect(pack).toHaveValue(/Please add tests\./);
 await expect(pack).toHaveValue(/app\.js: https:\/\/github\.com\/acme\/demo\/blob\/main\/app\.js/);
 await page.getByRole("button",{name:"Save issue"}).click();
 await page.getByRole("link",{name:"Saved",exact:true}).click();
 await expect(page.getByRole("heading",{name:"Saved issues"})).toBeVisible();
 await expect(page.getByRole("link",{name:"Fix crash on startup"})).toBeVisible();
});

test("invalid backup import preserves existing saved references",async({page})=>{
 await page.addInitScript(()=>localStorage.setItem("v36.saved.v1",JSON.stringify({version:1,exportedAt:"2026-01-01T00:00:00Z",issues:[{url:"https://github.com/acme/demo/issues/2",title:"Keep me",repository:"acme/demo",number:2}],searches:[]})));
 await page.goto("/#saved");
 await expect(page.getByRole("link",{name:"Keep me"})).toBeVisible();
 await page.locator("#import-file").setInputFiles({name:"bad.json",mimeType:"application/json",buffer:Buffer.from('{"version":2,"issues":[],"searches":[]}')});
 await expect(page.getByRole("status")).toContainText("Import rejected");
 await expect(page.getByRole("link",{name:"Keep me"})).toBeVisible();
});
