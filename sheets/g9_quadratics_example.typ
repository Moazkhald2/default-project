#import "@preview/cetz:0.5.2": canvas, draw

#set page(paper: "a4", margin: (x: 1.8cm, y: 1.6cm))
#set text(font: "Libertinus Serif", size: 10.5pt, lang: "en")
#set par(justify: false, leading: 0.55em)

#let header(academy: "The Math Mentor", unit: "G9 Quadratics", date: datetime.today()) = {
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

#let rulebox(body) = {
  block(
    width: 100%, inset: (x: 0.7em, y: 0.6em),
    stroke: (left: 2.5pt + rgb("#0a9396"), rest: 0.5pt + rgb("#e5e7eb")),
    radius: 6pt, fill: rgb("#e6f5f5"),
  )[
    #text(weight: "bold", size: 9pt, fill: rgb("#0a9396"))[RULE]
    #v(0.3em)
    #body
  ]
  v(0.6em)
}

#let worked(title, steps) = {
  block(
    width: 100%, inset: (x: 0.7em, y: 0.6em),
    stroke: (left: 2.5pt + rgb("#1a1a2e"), rest: 0.5pt + rgb("#e5e7eb")),
    radius: 6pt, fill: rgb("#ffffff"),
  )[
    #text(weight: "bold", size: 9pt)[WORKED: #title]
    #v(0.3em)
    #grid(
      columns: (1fr, 1fr), gutter: 0.7em,
      ..steps.map(s => (s.at(0), [#text(size: 9pt, fill: rgb("#636e72"), style: "italic")[#s.at(1)]])).flatten()
    )
  ]
  v(0.6em)
}

#let question(number, body, figure: none, points: 1) = {
  block(
    width: 100%, inset: (x: 0.6em, y: 0.6em),
    stroke: (left: 2pt + rgb("#111827"), rest: 0.5pt + rgb("#e5e7eb")),
    radius: 6pt, fill: rgb("#ffffff"),
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

#header()

// ===== BLOCK 1: Standard form (G9-08). Feeds everything below. =====
#rulebox[
  #align(center, $f(x) = a x^2 + b x + c quad (a != 0)$)
  #v(0.2em)
  Read left to right: $a$ before $x^2$, $b$ before $x$, $c$ alone.
  Keep the sign with its number. $c$ is the y-intercept.
]

#worked("Identify a, b, c", (
  ([#math.equation(block: false, $f(x) = x^2 - 2x - 3$)], [Already standard form.]),
  ([#math.equation(block: false, $a = 1, b = -2, c = -3$)], [Signs stay attached.]),
  ([y-intercept is $(0, -3)$], [c alone gives the cut.]),
  ([Keep these for Q2 to Q4], [Chain link forward.]),
))

#question(1, [
  Running function for this sheet: $f(x) = x^2 - 2 x - 3$. \
  *A (choose):* $a, b, c$ are \
  (a) $1, -2, -3$ \quad (b) $1, 2, 3$ \quad (c) $1, 2, -3$ \quad (d) $-1, -2, -3$ \
  *B (complete):* The y-intercept of $f$ is \_\_\_\_\_\_\_\_.
], points: 2)

// ===== BLOCK 2: Vertex + axis (G9-09/10). Uses Block 1. =====
#rulebox[
  #align(center, $x_v = -b / (2a) quad "axis:" x = x_v quad y_v = f(x_v)$)
  #v(0.2em)
  Vertex is the turning point. Axis cuts straight through it.
  If $a > 0$ it opens up and vertex is a minimum. If $a < 0$ it opens down and vertex is a maximum.
]

#worked("Vertex of the same f", (
  ([Step 1: $x_v = 2 / 2 = 1$], [Formula with Block 1 numbers.]),
  ([Step 2: $y_v = 1 - 2 - 3 = -4$], [Plug back into f.]),
  ([Vertex $(1, -4)$, axis $x = 1$], [Point plus line together.]),
  ([Shape: opens up], [Because $a = 1 > 0$.]),
))

#question(2, [
  *A (choose):* The vertex of $f(x) = x^2 - 2x - 3$ is \
  (a) $(1, -4)$ \quad (b) $(-1, 0)$ \quad (c) $(2, -3)$ \quad (d) $(0, -3)$ \
  *B (complete):* Axis: $x =$ \_\_\_ ; opens \_\_\_ (up / down).
], points: 2)

// ===== BLOCK 3: Graph YOU draw (G9-11/13). Uses Blocks 1-2. =====
#rulebox[
  #align(center, [Table #sym.arrow plot #sym.arrow join])
  #v(0.2em)
  1) Complete the table with your calculator. 2) Plot each point. 3) Join with a smooth curve through the vertex. Mark vertex, axis, intercepts.
]

#worked("Two table rows", (
  ([At $x = 3$: value $0$], [Follow order of operations.]),
  ([At $x = -1$: value $0$], [Negatives carefully.]),
  ([Plot points plus vertex], [Zeros meet the axis.]),
  ([Join smoothly], [Never ruler-straight.]),
))

#question(3, [
  Complete, then draw on the grid below. \
  #v(0.4em)
  #table(
    columns: (auto, auto, auto, auto, auto, auto, auto),
    stroke: 0.5pt,
    [*x*], [$-2$], [$-1$], [$0$], [$1$], [$2$], [$4$],
    [*y*], [$\_\_$], [$\_\_$], [$\_\_$], [$\_\_$], [$\_\_$], [$\_\_$],
  )
  #v(0.3em)
  Mark the vertex, the axis (dashed), and join the points.
], figure: canvas({
  import draw: *
  let lo = -4
  let hi = 5
  for x in range(lo * 2, hi * 2 + 1) {
    let gx = x / 2.0
    line((gx, lo), (gx, hi), stroke: 0.3pt + rgb("#e5e7eb"))
  }
  for y in range(lo, hi + 1) {
    line((lo, y), (hi, y), stroke: 0.3pt + rgb("#e5e7eb"))
  }
  line((lo, 0), (hi, 0), stroke: 1.0pt + rgb("#111827"))
  line((0, lo), (0, hi), stroke: 1.0pt + rgb("#111827"))
  for x in range(lo, hi + 1) {
    if x != 0 {
      line((x, -0.08), (x, 0.08), stroke: 0.7pt)
      content((x, 0), [#text(size: 6.5pt)[#str(x)]], anchor: "north", padding: 0.14)
    }
  }
  for y in range(lo, hi + 1) {
    if y != 0 {
      line((-0.08, y), (0.08, y), stroke: 0.7pt)
      content((0, y), [#text(size: 6.5pt)[#str(y)]], anchor: "east", padding: 0.14)
    }
  }
  content((hi, 0), [$x$], anchor: "south-west", padding: 0.12)
  content((0, hi), [$y$], anchor: "south-west", padding: 0.12)
  line((1, lo), (1, hi), stroke: (dash: "dashed", thickness: 0.6pt, paint: rgb("#0a9396")))
}), points: 4)

// ===== BLOCK 4: Max/min + zeros (G9-12/14/15/16). Reads off graph. =====
#rulebox[
  #align(center, [min/max is $y_v$ at vertex; zeros solve $f(x) = 0$])
  #v(0.2em)
  Up gives a minimum, down gives a maximum. Zeros are where the graph cuts the x-axis: factor, then zero-product rule.
]

#worked("Min plus zeros of the same f", (
  ([Minimum $y = -4$ at $x = 1$], [Read the vertex.]),
  ([Factor: $(x-3)(x+1)$], [Product minus 3, sum minus 2.]),
  ([So $x = 3$ or $x = -1$], [A zero bracket splits it.]),
  ([Matches the cuts on drawing], [Graph checks algebra.]),
))

#question(4, [
  *A (choose):* $f$ has a \_\_\_\_ value of \_\_\_\_ : (a) min, $-4$ \quad (b) max, $-4$ \quad (c) min, $4$ \quad (d) max, $3$ \
  *B (essay):* Find the zeros of $f$ algebraically, then confirm them on your graph. \
  *C (number context):* Two numbers differ by $2$ and their product is $-3$. Let the smaller be $x$. Show this gives $x^2 + 2x - 3 = 0$, then find both numbers.
], points: 4)

// ===== ANSWER KEY: final answers only =====
#block(
  width: 100%, inset: (x: 0.7em, y: 0.6em),
  stroke: (left: 2.5pt + rgb("#d4a373"), rest: 0.5pt + rgb("#e5e7eb")),
  radius: 6pt, fill: rgb("#faf9f6"),
)[
  #text(weight: "bold")[ANSWER KEY: final answers only]
  #v(0.3em)
  Q1-A: (a) #h(1em) Q1-B: $(0, -3)$ \
  Q2-A: (a) #h(1em) Q2-B: $x = 1$; up \
  Q3 table: $5, 0, -3, -4, -3, 5$; graph: U through $(1,-4)$, cuts $(-1,0), (3,0)$ \
  Q4-A: (a) #h(1em) Q4-B: $x = 3$ or $x = -1$ #h(1em) Q4-C: $-3$ and $-1$
]
