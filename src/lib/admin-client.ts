function getCookieValue(name: string): string | null {
  const prefix = `${name}=`;
  const cookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(prefix));

  return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : null;
}

export function adminMutationFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  const csrfToken = getCookieValue("admin_csrf");

  if (csrfToken) {
    headers.set("X-CSRF-Token", csrfToken);
  }

  return fetch(input, {
    ...init,
    headers,
  });
}
