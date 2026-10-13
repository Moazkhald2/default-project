import { useState, useEffect } from "react";
import { api, apiGet } from "../lib/api";
export function AuthBar() {
  const [user, setUser] = useState<{ name: string; role: string; email: string } | null>(null);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  useEffect(() => {
    void apiGet<{ user: { name: string; role: string; email: string } }>("/api/auth/me")
      .then((j) => j?.user && setUser(j.user))
      .catch(() => {});
  }, []);
  const login = () => {
    void api<{ user: { name: string; role: string; email: string } }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password: pass }),
    }).then((j) => j?.user && setUser(j.user));
  };
  const logout = () => {
    void api("/api/auth/logout", { method: "POST" }).then(() => setUser(null));
  };
  if (user) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-2 text-sm shadow-sm">
        <span className="font-medium text-ink">{user.name}</span>
        <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-white">{user.role}</span>
        <button
          onClick={logout}
          className="ml-auto underline decoration-border underline-offset-4 hover:text-ink"
        >
          Logout
        </button>
      </div>
    );
  }
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-surface p-3 shadow-sm">
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="email"
        className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary"
      />
      <input
        value={pass}
        onChange={(e) => setPass(e.target.value)}
        type="password"
        placeholder="pass"
        className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary"
      />
      <button
        onClick={login}
        className="rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-white hover:bg-primary-hover"
      >
        Login
      </button>
    </div>
  );
}
