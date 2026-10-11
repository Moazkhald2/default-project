// Shared API client — wires every department (auth, students, exams, hrms, stripe)
// through one token-aware fetch. Same-origin: Vite proxies /api → :3000 in dev.
export function authHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const t = localStorage.getItem("token");
  return t ? { Authorization: `Bearer ${t}`, ...extra } : extra;
}
export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...((init.headers as Record<string, string>) ?? {}),
    },
  });
  if (!res.ok) throw new Error(`${init.method ?? "GET"} ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}
export const apiGet = <T>(path: string): Promise<T> =>
  fetch(path, { headers: authHeaders() }).then((r) => {
    if (!r.ok) throw new Error(`GET ${path} → ${r.status}`);
    return r.json() as Promise<T>;
  });
