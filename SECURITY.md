# Security policy

## Scope and principles

V36 is a static client-side application that reads public GitHub data and may import user-selected JSON files. Treat all remote content and imported data as untrusted.

- Never hard-code a credential, personal access token, password, or secret API key in source. On `main`, do not store tokens. The separately approved `feature/github-token-auth` experiment permits optional browser storage only after explicit user opt-in and a same-origin JavaScript/XSS warning; session-only memory is the default. Never export a token or send it anywhere except `api.github.com`.
- Do not execute code obtained from GitHub issues, README files, repository files, URLs, or imported files.
- Render untrusted content as text. If Markdown rendering is introduced, use a maintained sanitizer and test it against script, event-handler, URL-scheme, and HTML injection payloads.
- Validate imported data by schema, type, length, item count, and total file size before saving it.
- Do not silently overwrite saved data or discard saved references during import.
- Respect GitHub API limits; do not implement limit bypasses or require users to supply a token. Token-based authentication is optional and experimental on `feature/github-token-auth` only; `main` remains anonymous by default until review and merge.
- External links must be explicit and safely opened. Do not automatically navigate to URLs found in issue text.

## Reporting a vulnerability

Please use GitHub's private vulnerability reporting feature for this repository if available. Otherwise, contact the repository owner privately through GitHub. Avoid posting exploitable details in a public issue until a fix can be coordinated.

## Release verification

Security-sensitive tests must cover untrusted text rendering, malformed and oversized imports, duplicate records, unsafe URL handling, and preservation of unrelated saved data. These guidelines do not guarantee the absence of vulnerabilities.
