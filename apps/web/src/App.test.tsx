import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";
describe("App", () => {
  it("renders hero with LCP image having fetchpriority high", () => {
    render(<App />);
    const img = screen.getByAltText("Hero");
    expect(img.getAttribute("fetchpriority")).toBe("high");
    expect(img.getAttribute("width")).toBeTruthy();
    expect(img.getAttribute("height")).toBeTruthy();
    expect(img.getAttribute("loading")).not.toBe("lazy");
  });
});
