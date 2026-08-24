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
#header(academy: "Math Academy — Geometry", unit: "Mixed • Grade 10", date: datetime.today())

#question(1, [
  The circle with centre $O$ has chord $A B$. If $angle A O B = 80 degree$, find the inscribed angle $angle A C B$ subtended by the same arc $A B$.
], figure: image("../assets/geometry_templates/circle-inscribed-angle.svg", width: 60%), points: 3)

#question(2, [
  Two parallel lines $l$ and $m$ are cut by a transversal. If one corresponding angle is $65 degree$, find the vertical opposite angle.
], figure: image("../assets/geometry_templates/parallel-transversal.svg", width: 60%), points: 2)

#question(3, [
  In the right-angled triangle $A B C$ with $angle B = 90 degree$, $A B = 4"cm"$ and $B C = 3"cm"$, find $x = angle A$.
], figure: image("../assets/geometry_templates/right-triangle.svg", width: 60%), points: 2)

