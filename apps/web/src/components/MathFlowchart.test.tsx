import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MathFlowchart, rightTriangleSpec, circleTheoremSpec } from "./MathFlowchart";

describe("MathFlowchart", () => {
  it("renders title and first node", () => {
    const { container } = render(<MathFlowchart spec={rightTriangleSpec} interactive={false} />);
    expect(container.textContent).toContain("Right Triangle");
    expect(container.textContent).toContain("Start: Right");
  });

  it("renders circle theorem spec with 5 nodes when interactive false", () => {
    const { container } = render(<MathFlowchart spec={circleTheoremSpec} interactive={false} />);
    expect(container.textContent).toContain("Central");
    expect(container.textContent).toContain("40");
  });

  it("shows locked steps when interactive", () => {
    const { container } = render(<MathFlowchart spec={rightTriangleSpec} interactive />);
    expect(container.textContent).toContain("locked");
  });

  it("non-interactive reveals all", () => {
    const { container } = render(<MathFlowchart spec={rightTriangleSpec} interactive={false} />);
    expect(container.textContent).toContain("Compute");
  });
});
