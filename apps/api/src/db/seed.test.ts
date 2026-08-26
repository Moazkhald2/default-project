import { describe, it, expect } from "vitest";
import { existingVaultRoots } from "./seed";

describe("existingVaultRoots", () => {
  it("returns only question-bank directories that exist", () => {
    const roots = existingVaultRoots();
    expect(roots.length).toBe(2);
    expect(roots.some((r) => r.includes("Local_Math_Vault"))).toBe(true);
    expect(roots.some((r) => r.includes("content") && r.includes("bank"))).toBe(true);
  });
});
