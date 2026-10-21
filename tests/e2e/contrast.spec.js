import {test, expect} from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const hash of ["#discover", "#saved", "#about"]) {
  test("automated colour-contrast scan " + hash, async ({page}) => {
    await page.goto("/" + hash);
    const result = await new AxeBuilder({page}).withRules(["color-contrast"]).analyze();
    console.log("CONTRAST " + hash + ": violations=" + result.violations.length +
      " incomplete=" + result.incomplete.length + " passes=" + result.passes.length);
    expect(result.violations).toEqual([]);
  });
}

test("inferred labels remain distinguishable and contrast scan covers issue details", async ({page}) => {
  const issue = {
    html_url: "https://github.com/acme/demo/issues/31",
    title: "Crash regression needs a fix",
    body: "A crash bug causes failure during startup.",
    state: "open",
    number: 31,
    created_at: "2026-01-20T00:00:00Z",
    updated_at: "2026-01-30T00:00:00Z",
    closed_at: null,
    comments: 2,
    labels: [{name: "needs triage"}],
    repository_url: "https://api.github.com/repos/acme/demo"
  };
  const repo = {
    full_name: "acme/demo",
    html_url: "https://github.com/acme/demo",
    language: "JavaScript",
    stargazers_count: 9,
    pushed_at: "2026-01-29T00:00:00Z",
    default_branch: "main"
  };

  await page.route("https://api.github.com/**", async route => {
    const u = new URL(route.request().url());
    if (u.pathname === "/search/issues") {
      await new Promise(resolve => setTimeout(resolve, 150));
      return route.fulfill({json: {total_count: 1, incomplete_results: false, items: [issue]}});
    }
    if (u.pathname === "/repos/acme/demo/issues/31") return route.fulfill({json: issue});
    if (u.pathname === "/repos/acme/demo/readme") return route.fulfill({json: {
      html_url: "https://github.com/acme/demo/blob/main/README.md",
      encoding: "base64",
      content: "IyBEZW1v"
    }});
    if (u.pathname === "/repos/acme/demo/commits") return route.fulfill({json: [{
      html_url: "https://github.com/acme/demo/commit/abc",
      commit: {committer: {date: "2026-01-29T00:00:00Z"}}
    }]});
    if (u.pathname === "/repos/acme/demo") return route.fulfill({json: repo});
    return route.fulfill({status: 404, json: {message: "not mocked"}});
  });

  await page.goto("/");
  const submit = page.getByRole("button", {name: "Search GitHub"});
  await page.getByLabel("Search issues").fill("crash");
  await submit.click();
  await expect(submit).toBeDisabled();

  const disabledStyles = await submit.evaluate(el => ({
    opacity: getComputedStyle(el).opacity,
    background: getComputedStyle(el).backgroundColor,
    color: getComputedStyle(el).color,
    disabled: el.disabled
  }));
  console.log("DISABLED_CONTROL_STYLES:", JSON.stringify(disabledStyles));
  expect(disabledStyles.disabled).toBe(true);
  expect(Number(disabledStyles.opacity)).toBeGreaterThan(0);

  const inferred = page.locator(".tag.inferred");
  await expect(inferred.first()).toBeVisible();
  await expect(inferred.first()).toContainText("Inferred:");
  const inferredStyles = await inferred.first().evaluate(el => ({
    color: getComputedStyle(el).color,
    background: getComputedStyle(el).backgroundColor,
    borderStyle: getComputedStyle(el).borderTopStyle
  }));
  console.log("INFERRED_LABEL_STYLES:", JSON.stringify(inferredStyles));
  expect(inferredStyles.borderStyle).toBe("dashed");
  const resultsScan = await new AxeBuilder({page}).withRules(["color-contrast"]).analyze();
  expect(resultsScan.violations).toEqual([]);

  await page.getByRole("button", {name: "View details"}).click();
  await expect(page.getByRole("heading", {name: issue.title})).toBeVisible();
  const detailScan = await new AxeBuilder({page}).withRules(["color-contrast"]).analyze();
  console.log("CONTRAST detail: violations=" + detailScan.violations.length +
    " incomplete=" + detailScan.incomplete.length + " passes=" + detailScan.passes.length);
  expect(detailScan.violations).toEqual([]);
});
