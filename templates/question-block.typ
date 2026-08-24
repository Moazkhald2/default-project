// SNIPPET TEMPLATE — AI outputs ONLY this block per question.
// Insert into sheet.typ via #include or manual injection.
// NEVER output page margins/imports here.

#question(4, [
  // prompt with $ ... $ math
  Your question text here with $x^2 + y^2 = r^2$.
], figure: canvas({
  import draw: *
  // 1) define points as let P = (x,y)
  // 2) draw lines/circles
  // 3) anchor labels: content(P, [$P$], anchor: "...")
  let A = (0, 0)
  let B = (3, 0)
  let C = (1.5, 2.2)
  line(A, B, C, close: true, stroke: 1.2pt)
  content(A, [$A$], anchor: "north-east")
  content(B, [$B$], anchor: "north-west")
  content(C, [$C$], anchor: "south")
}), points: 2)
