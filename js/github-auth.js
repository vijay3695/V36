const API_ORIGIN = "https://api.github.com";
const STORAGE_KEY = "v36.github-token.v1";
let activeToken = "";
let remembered = false;

export function getGitHubToken() {
  return activeToken;
}

export function hasGitHubToken() {
  return Boolean(activeToken);
}

export function isTokenRemembered() {
  return remembered;
}

export function restoreRememberedToken() {
  try {
    const stored = globalThis.localStorage?.getItem(STORAGE_KEY);
    if (typeof stored === "string" && stored.length > 0) {
      activeToken = stored;
      remembered = true;
      return true;
    }
  } catch {
    // Storage may be disabled; anonymous and session-only modes still work.
  }
  return false;
}

export async function connectGitHubToken(value, remember = false) {
  const candidate = String(value || "").trim();
  if (!candidate) throw new Error("Enter a GitHub fine-grained personal access token.");
  if (!/^(github_pat_[A-Za-z0-9_]+|ghp_[A-Za-z0-9]+)$/.test(candidate)) {
    throw new Error("That token format is not recognized. Paste a GitHub personal access token.");
  }

  let response;
  try {
    response = await fetch(API_ORIGIN + "/rate_limit", {
      method: "GET",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: "Bearer " + candidate,
        "X-GitHub-Api-Version": "2022-11-28"
      },
      cache: "no-store",
      credentials: "omit",
      redirect: "error"
    });
  } catch {
    throw new Error("Could not validate the token with GitHub. Check your connection and retry.");
  }
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error("GitHub did not accept this token. Check that it is valid and not expired.");
    }
    throw new Error("GitHub could not validate the token right now. Try again later.");
  }

  // Never persist a token until GitHub has accepted it.
  activeToken = candidate;
  remembered = false;
  try {
    globalThis.localStorage?.removeItem(STORAGE_KEY);
    if (remember) {
      globalThis.localStorage?.setItem(STORAGE_KEY, candidate);
      remembered = true;
    }
  } catch {
    if (remember) {
      activeToken = candidate;
      remembered = false;
      throw new Error("GitHub accepted the token, but browser storage is unavailable. Reconnect without device storage or enable browser storage.");
    }
  }
  return { remembered };
}

export function disconnectGitHubToken() {
  activeToken = "";
  remembered = false;
  try {
    globalThis.localStorage?.removeItem(STORAGE_KEY);
  } catch {
    // Memory is cleared even when browser storage is unavailable.
  }
}
