// Shared API client — wires every department (auth, students, exams, hrms, stripe)
// through one cookie-aware fetch. Same-origin: Vite proxies /api → :3000 in dev.
// H2: JWT is stored in an httpOnly cookie set by /api/auth/login — no localStorage.
export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...((init.headers as Record<string, string>) ?? {}),
    },
  });
  if (!res.ok) throw new Error(`${init.method ?? "GET"} ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}
export const apiGet = <T>(path: string): Promise<T> =>
  fetch(path, { credentials: "include" }).then((r) => {
    if (!r.ok) throw new Error(`GET ${path} → ${r.status}`);
    return r.json() as Promise<T>;
  });
