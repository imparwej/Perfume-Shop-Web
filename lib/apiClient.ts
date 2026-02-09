const API_BASE = "http://localhost:8080";

const TOKEN_KEY = "maison_noir_token"; // ⭐ SAME KEY AS AUTH CONTEXT

export async function apiFetch(
  url: string,
  options: RequestInit = {}
) {
  const token = localStorage.getItem(TOKEN_KEY);

  const res = await fetch(API_BASE + url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (res.status === 401) {
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = "/login";
    return;
  }

  return res;
}
