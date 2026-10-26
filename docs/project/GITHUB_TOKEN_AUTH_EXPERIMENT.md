# GitHub Token Authentication Experiment

**Status:** Approved experiment plan; implementation not started  
**Branch:** `feature/github-token-auth`  
**Base:** `main`  
**Scope:** Isolated investigation and prototype only. This document does not change the current product contract or authorize merging.

## 1. Purpose

Evaluate whether an optional user-supplied GitHub fine-grained personal access token (PAT) can improve V36's GitHub API capacity while preserving the existing anonymous experience and the static GitHub Pages architecture.

This is an experiment, not a claim that authentication removes all limits. GitHub Search API has separate rate limits, and behavior must be measured and documented.

## 2. Non-negotiable requirements

1. **Anonymous mode remains fully functional.** A visitor who does not connect GitHub must retain the current discovery behavior and existing rate-limit handling.
2. **Strict token boundary.** A token may be sent only in the Authorization header of intended requests to the official GitHub API host (`api.github.com`). Never send it to other hosts or include it in URL paths, query parameters, fragments, referrers, or page navigation.
3. **No token leakage.** Never log, print, expose in error messages, place in analytics/telemetry, include in share URLs, or include in saved-search exports/imports, context packs, screenshots, test reports, or diagnostic output.
4. **No server or paid dependency.** No backend, serverless proxy, database, third-party token exchange, or paid service.
5. **No writes.** V36 uses the token only for read-only discovery requests. The application must not create, edit, close, react to, or otherwise mutate GitHub resources.
6. **Explicit consent.** Explain that a PAT is a credential, ask the user to paste it intentionally, and make storage choice clear. Provide a disconnect action.
7. **No false OAuth claim.** Label this as optional token-based connection, not GitHub OAuth login.
8. **No change to `main`.** All prototype code and documentation changes stay on this branch until reviewed and explicitly approved for merge.

## 3. Proposed user experience

- Existing anonymous mode remains the default.
- An optional “Connect GitHub” / “Use a personal access token” control explains why a token may help and links directly to GitHub's fine-grained token creation page.
- Token input is masked by default, with clear show/hide control if implemented.
- Validate the token with a minimal, read-only request to the official GitHub API. Never echo the token in UI or logs.
- Offer an explicit “Remember on this device” choice. If declined, keep the token only in memory for the current page session and clear it when the page is closed/reloaded.
- If remembered, use browser-local storage only after explicit consent; disclose that same-origin JavaScript running on the device can access it. Never describe localStorage as encrypted or safe from XSS.
- “Disconnect” clears the in-memory and persisted token immediately and returns the user to anonymous mode.
- Invalid, expired, revoked, insufficiently scoped, rate-limited, offline, and API-failure states must be distinct where they can be reliably identified. Do not discard current results on failure.
- Never require connection to use V36.

## 4. Permission and API policy

- Investigate the minimum viable fine-grained PAT permissions against the exact endpoints V36 uses. Prefer no repository write permissions and no broader access than necessary.
- Do not request classic PAT scopes by default.
- Do not claim “read-only” is guaranteed by the token type alone; validate the actual permissions and ensure the application itself only issues GET requests.
- Preserve existing query behavior and pagination. Add authorization only to explicitly allowlisted GitHub API requests.
- Do not forward user tokens to arbitrary URLs, repository-provided links, raw content hosts, or any URL derived from untrusted issue content.
- On API rate-limit responses, preserve results and saved data, show an accurate message, and respect GitHub's reset/retry guidance. Do not retry aggressively or attempt to bypass limits.
- Measure ordinary REST API and Search API behavior separately. Do not promise that the general authenticated limit applies to search.

## 5. Security design and risks

- Centralize token attachment in one narrowly scoped API request layer; validate the destination origin before attaching Authorization.
- Avoid logging request headers, request objects, token-bearing exceptions, or unredacted network diagnostics.
- Do not store the token in shareable URLs, filter state, saved issue/search data, export files, context packs, DOM attributes, or global debug state.
- Keep token state separate from ordinary persisted app data.
- Treat imported files and GitHub content as untrusted. No imported value can set or replace the token.
- Test storage clearing on disconnect and ensure failed validation never persists a token.
- A static browser app cannot protect a token from malicious JavaScript executing on the same origin or from a compromised browser/device. This limitation must be stated clearly; if the risk is unacceptable, do not ship token persistence.
- Test that all token-bearing requests target only `https://api.github.com` and that external links/content requests never receive Authorization.
- Use fake test tokens only; never use a real PAT in automated tests, fixtures, commits, CI variables, screenshots, or reports.

## 6. Acceptance criteria

### Compatibility and functionality
- [ ] Existing anonymous discovery works with no token and matches baseline behavior.
- [ ] Anonymous mode still works after connect, disconnect, invalid token, expired token, network failure, and rate-limit response.
- [ ] Token validation succeeds/fails with accurate, non-sensitive UI feedback.
- [ ] Authenticated requests use only required read-only API endpoints.
- [ ] Disconnect clears the token from memory and any opted-in local storage.
- [ ] Remember choice is explicit and behaves as documented across reloads.
- [ ] Existing saved issues, saved searches, filter URLs, imports/exports, context packs, details, and pagination remain compatible.

### Security
- [ ] Automated tests assert Authorization is attached only to allowlisted `https://api.github.com` requests.
- [ ] Tests assert no token appears in URLs, console output, UI text, errors, analytics, exports, imports, context packs, or persisted non-token app data.
- [ ] Requests to GitHub web pages, raw-content hosts, arbitrary URLs, and external links never include Authorization.
- [ ] Malformed imports cannot inject or overwrite token state.
- [ ] No token is present in source, fixtures, test snapshots, logs, CI artifacts, or commits.
- [ ] Document the same-origin JavaScript/XSS and local-device risks of browser-side storage.

### Rate-limit evidence
- [ ] Capture response headers/status and reset behavior for anonymous and authenticated general REST requests.
- [ ] Test Search API limits separately; document results without assuming they match general REST limits.
- [ ] Verify rate-limit failures preserve loaded results and saved data and do not trigger aggressive retries.
- [ ] Report actual test conditions, evidence, limitations, and any live tests not run.

### Quality and accessibility
- [ ] Existing unit, browser end-to-end, accessibility, and repository CI checks pass.
- [ ] Add tests for keyboard operation, focus handling, masked input, status announcements, and narrow viewports.
- [ ] Verify no regression in light/dark themes, contrast, reduced motion, and existing responsive behavior.
- [ ] Review dependency and complexity impact; do not add a dependency without a demonstrated need.

## 7. Test method

1. Record the current branch baseline and run the existing test suite before implementation.
2. Build a test matrix covering anonymous, connected, remembered, session-only, invalid, expired/revoked, disconnect, network error, general REST rate limit, and Search API rate limit.
3. Use deterministic mocked responses for routine tests. Use a manually supplied test token only for optional local live verification; never record the token or include it in test evidence.
4. Run all existing checks plus new security and regression tests.
5. Review source and test diffs for accidental token sinks and unauthorized request destinations.
6. Report pass/fail per acceptance item. Mark untested items “not verified,” never “pass.”

## 8. Decision gate

Do not merge merely because the prototype works.

Recommend merge only if every mandatory compatibility/security check passes, the actual rate-limit benefit is demonstrated and accurately described, browser-storage risks are acceptable, and the maintainer reviews the evidence. If the token does not materially help the app, or safe handling cannot be demonstrated, abandon the feature without affecting `main`.

If the experiment passes, separately update the canonical product specification and decision log to replace the current “no token requirement / no credential storage” rule with the explicitly optional, consent-based design. That scope change must be reviewed before merge. Until then, the existing `main` product contract remains unchanged.
