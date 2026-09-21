import { describe, it, expect } from "vitest";
import { shouldRunToday, isAllowedSearchHost } from "./boot-improve.mjs";
describe("guard", () => {
  it("skips when guard is today", () => {
    expect(shouldRunToday("2026-09-22", "2026-09-22")).toBe(false);
  });
  it("runs when guard differs", () => {
    expect(shouldRunToday("2026-09-22", "2026-09-21")).toBe(true);
  });
});
describe("search allowlist", () => {
  it("allows github releases", () => {
    expect(isAllowedSearchHost("https://github.com/modelcontextprotocol/modelcontextprotocol/releases")).toBe(true);
  });
  it("blocks random blog", () => {
    expect(isAllowedSearchHost("https://random-blog.xyz/hack")).toBe(false);
  });
});
