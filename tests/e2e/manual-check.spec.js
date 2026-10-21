import {test, expect} from "@playwright/test";

test("manual: skip link is first tab stop", async ({page}) => {
  await page.goto("http://127.0.0.1:4173/");
  await page.keyboard.press("Tab");
  await expect(page.locator(".skip-link")).toBeFocused();
});

test("manual: tab through discover controls without trapping", async ({page}) => {
  await page.goto("http://127.0.0.1:4173/");
  const stops = [];
  for (let i = 0; i < 25; i++) {
    await page.keyboard.press("Tab");
    const tag = await page.evaluate(() => {
      const e = document.activeElement;
      return e ? e.tagName + (e.id ? "#" + e.id : "") : "none";
    });
    stops.push(tag);
  }
  console.log("TAB_STOPS:", stops.join(" -> "));
  expect(stops.filter(t => t !== "BODY").length).toBeGreaterThan(5);
});

test("manual: responsive no horizontal overflow", async ({page}) => {
  for (const width of [320, 375, 768, 1280]) {
    await page.setViewportSize({width, height: 800});
    await page.goto("http://127.0.0.1:4173/");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    console.log(`OVERFLOW@${width}: ${overflow}`);
    expect(overflow).toBe(false);
  }
});

test("manual: reduced motion disables transitions, animations and smooth scrolling", async ({page}) => {
  await page.emulateMedia({reducedMotion: "reduce"});
  await page.goto("http://127.0.0.1:4173/");

  await expect.poll(() => page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(true);

  const styles = await page.evaluate(() => {
    const elements = [...document.querySelectorAll("html, body, .button, .panel, .issue-card, .site-header")];
    const durationInMs = value => {
      const parts = value.split(",").map(part => part.trim());
      return parts.map(part => parseFloat(part) * (part.endsWith("ms") ? 1 : 1000));
    };
    return {
      scroll: getComputedStyle(document.documentElement).scrollBehavior,
      elements: elements.map(el => ({
        selector: el.tagName.toLowerCase() + (el.className && typeof el.className === "string" ? "." + el.className.trim().replace(/\s+/g, ".") : ""),
        transitionMs: durationInMs(getComputedStyle(el).transitionDuration),
        animationMs: durationInMs(getComputedStyle(el).animationDuration),
        animationIterationCount: getComputedStyle(el).animationIterationCount
      }))
    };
  });

  console.log("REDUCED_MOTION:", JSON.stringify(styles));
  expect(styles.scroll).toBe("auto");
  expect(styles.elements.length).toBeGreaterThan(0);
  for (const el of styles.elements) {
    expect(el.transitionMs.every(ms => ms <= 1), `${el.selector} transition duration should be <= 1ms: ${el.transitionMs}`).toBe(true);
    expect(el.animationMs.every(ms => ms <= 1), `${el.selector} animation duration should be <= 1ms: ${el.animationMs}`).toBe(true);
    expect(el.animationIterationCount).not.toBe("infinite");
  }
});

test("manual: open detail and verify focus moves to heading", async ({page}) => {
  await page.route("https://api.github.com/**", async route => {
    const u = new URL(route.request().url());
    if (u.pathname === "/search/issues") return route.fulfill({json: {total_count: 1, incomplete_results: false, items: [{html_url: "https://github.com/acme/demo/issues/1", title: "Crash issue", body: "details", state: "open", number: 1, created_at: "2026-01-20T00:00:00Z", updated_at: "2026-01-30T00:00:00Z", labels: [{name: "bug"}], repository_url: "https://api.github.com/repos/acme/demo"}]}});
    if (u.pathname === "/repos/acme/demo/issues/1") return route.fulfill({json: {html_url: "https://github.com/acme/demo/issues/1", title: "Crash issue", body: "details", state: "open", number: 1, created_at: "2026-01-20T00:00:00Z", updated_at: "2026-01-30T00:00:00Z", labels: [{name: "bug"}], repository_url: "https://api.github.com/repos/acme/demo"}});
    if (u.pathname === "/repos/acme/demo") return route.fulfill({json: {full_name: "acme/demo", html_url: "https://github.com/acme/demo", language: "JavaScript", stargazers_count: 10, pushed_at: "2026-01-29T00:00:00Z"}});
    if (u.pathname === "/repos/acme/demo/readme") return route.fulfill({json: {html_url: "https://github.com/acme/demo/blob/main/README.md", encoding: "base64", content: "IyBEZW1v"}});
    if (u.pathname === "/repos/acme/demo/commits") return route.fulfill({json: []});
    return route.fulfill({status: 404, json: {message: "not mocked"}});
  });
  await page.goto("http://127.0.0.1:4173/");
  await page.getByLabel("Search issues").fill("crash");
  await page.getByRole("button", {name: "Search GitHub"}).click();
  await page.getByRole("button", {name: "View details"}).click();
  await expect(page.getByRole("heading", {name: "Crash issue"})).toBeFocused();
});
