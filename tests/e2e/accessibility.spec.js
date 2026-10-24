import {test,expect} from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
for(const hash of ["#discover","#saved","#about"]){
 for(const theme of ["dark","light"]){
  test("automated accessibility scan "+hash+" in "+theme+" theme",async({page})=>{
   await page.goto("/"+hash);
   await page.evaluate(value=>{document.documentElement.dataset.theme=value;},theme);
   const r=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa"]).analyze();
   expect(r.violations).toEqual([]);
  });
 }
}
