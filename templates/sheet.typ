#import "@preview/cetz:0.5.2": canvas, draw
#import "@preview/cetz:0.5.2" as cetz

// ===== MASTER SHEET TEMPLATE — DO NOT REGENERATE PER QUESTION =====
// AI MUST output ONLY #question[...] blocks below this header.
// Geometry: use CeTZ with ANCHORED labels, never absolute text coords.

#set page(paper: "a4", margin: (x: 1.8cm, y: 1.6cm))
#set text(font: "Libertinus Serif", size: 10.5pt, lang: "en")
#set par(justify: false, leading: 0.55em)
#show heading: set text(weight: "bold")

// ---- Brand header ----
#let header(academy: "Math Academy", unit: "Unit", date: datetime.today()) = {
  grid(
    columns: (1fr, auto),
    gutter: 1em,
    align(left)[#text(weight: "bold", size: 12pt)[#academy] #h(0.5em) #text(fill: rgb("#6b7280"))[| #unit]],
    align(right)[#text(size: 9pt, fill: rgb("#6b7280"))[#date.display("[year]-[month]-[day]")]],
  )
  line(length: 100%, stroke: 0.6pt + rgb("#e5e7eb"))
  v(0.6em)
  grid(
    columns: (1fr, 1fr, 1fr),
    gutter: 0.8em,
    [#text(size: 8.5pt)[Name: #line(length: 5cm, stroke: 0.4pt)]],
    [#text(size: 8.5pt)[Class: #line(length: 3cm, stroke: 0.4pt)]],
    [#text(size: 8.5pt)[Score: #box(width: 2cm, height: 0.9em, stroke: 0.4pt)]],
  )
  v(1em)
}

// ---- Question block ----
#let question(number, body, figure: none, points: 1) = {
  block(
    width: 100%,
    inset: (x: 0.6em, y: 0.6em),
    stroke: (left: 2pt + rgb("#111827"), rest: 0.5pt + rgb("#e5e7eb")),
    radius: 6pt,
    fill: rgb("#ffffff"),
  )[
    #text(weight: "bold")[Question #number] #h(0.4em) #text(size: 8pt, fill: rgb("#6b7280"))[(#points pt)]
    #v(0.4em)
    #body
    #if figure != none {
      v(0.6em)
      align(center)[#figure]
    }
  ]
  v(0.7em)
}

// ---- Anchored helpers (enforce) ----
#let anchored-point(name, coord) = coord
#let anchored-label(point, label, anchor: "south", padding: 0.15) = {
  draw.content(point, [#label], anchor: anchor, padding: padding)
}

// Example canvas usage:
// #canvas({
//   import draw: *
//   let A = (0, 0); let B = (4, 0); let C = (4, 3)
//   line(A, B, C, close: true, stroke: 1.2pt)
//   content(A, [$A$], anchor: "north-east", padding: .12)
//   content(B, [$B$], anchor: "north-west", padding: .12)
//   content(C, [$C$], anchor: "south-west", padding: .12)
// })

// ===== INJECTED CONTENT STARTS HERE =====
#header(academy: "Math Academy — Geometry", unit: "Circle Theorems • Grade 10", date: datetime.today())

#question(1, [
  In the right-angled triangle $A B C$ below, $angle B = 90 degree$, $A B = 4 "cm"$, $B C = 3 "cm"$. Find $x = angle A$.
], figure: canvas({
  import draw: *
  let A = (0, 0)
  let B = (4, 0)
  let C = (4, 3)
  // triangle
  line(A, B, C, close: true, stroke: 1.3pt)
  // right angle mark
  line((3.6, 0), (3.6, 0.4), (4, 0.4), stroke: 0.7pt)
  // anchored labels - NEVER absolute floating text
  content(A, [$A$], anchor: "north-east", padding: .14)
  content(B, [$B$], anchor: "north-west", padding: .14)
  content(C, [$C$], anchor: "south-west", padding: .14)
  content((2, 0), [$4 "cm"$], anchor: "north", padding: .18)
  content((4, 1.5), [$3 "cm"$], anchor: "west", padding: .18)
  content((0.9, 0.35), [$x$], anchor: "center")
}), points: 2)

#question(2, [
  The circle with centre $O$ has chord $A B$. If $angle A O B = 80 degree$, find the inscribed angle $angle A C B$ subtended by the same arc.
], figure: canvas({
  import draw: *
  let O = (0, 0)
  circle(O, radius: 1.6, stroke: 1.2pt)
  let A = (1.13, 1.13)
  let B = (1.13, -1.13)
  let C = (-1.3, 0.4)
  line(O, A, stroke: 0.8pt)
  line(O, B, stroke: 0.8pt)
  line(A, C, stroke: 0.9pt)
  line(B, C, stroke: 0.9pt)
  circle(O, radius: 0.07, fill: black)
  circle(A, radius: 0.05, fill: black)
  circle(B, radius: 0.05, fill: black)
  circle(C, radius: 0.05, fill: black)
  content(O, [$O$], anchor: "south-east", padding: .12)
  content(A, [$A$], anchor: "south-west", padding: .12)
  content(B, [$B$], anchor: "north-west", padding: .12)
  content(C, [$C$], anchor: "east", padding: .12)
}), points: 3)

#question(3, [
  Two parallel lines $l$ and $m$ are cut by a transversal. If one corresponding angle is $65 degree$, find all remaining angles.
], figure: canvas({
  import draw: *
  line((-1.5, 1), (2.5, 1), stroke: 1.1pt)
  line((-1.5, -1), (2.5, -1), stroke: 1.1pt)
  line((-0.5, -1.8), (1.2, 1.8), stroke: 1.0pt)
  content((-1.6, 1), [$l$], anchor: "east")
  content((-1.6, -1), [$m$], anchor: "east")
  content((0.35, 0.55), [$65 degree$], anchor: "south", padding: .12)
}), points: 2)
