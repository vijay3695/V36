import {test,expect} from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
for(const hash of ["#discover","#saved","#about"])test("automated accessibility scan "+hash,async({page})=>{await page.goto("/"+hash);const r=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa"]).analyze();expect(r.violations).toEqual([]);});
