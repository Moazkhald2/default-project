import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MathExam } from "./MathExam";

describe("MathExam", () => {
  it("renders KaTeX exam", () => {
    render(
      <MathExam
        title="Test"
        questions={[{ id: "q1", prompt: "Find $x$", mathTeX: "x^2=4", options: ["2", "-2"] }]}
      />,
    );
    expect(screen.getByText("Test")).toBeTruthy();
    expect(screen.getByText(/Question 1/)).toBeTruthy();
  });
});
