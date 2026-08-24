import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Math, BlockMath } from "./Math";

describe("Math", () => {
  it("renders inline KaTeX", () => {
    const { container } = render(<Math tex={String.raw`a^2+b^2=c^2`} />);
    expect(container.innerHTML).toContain("katex");
  });
  it("renders display KaTeX", () => {
    const { container } = render(<BlockMath tex={String.raw`\int_0^1 x dx`} />);
    expect(container.innerHTML).toContain("katex-display");
  });
  it("handles invalid tex gracefully", () => {
    const { container } = render(<Math tex={String.raw`\invalid{`} />);
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });
});
