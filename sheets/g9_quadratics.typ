#import "@preview/cetz:0.5.2": canvas, draw

#set page(paper: "a4", margin: (x: 1.8cm, y: 1.6cm))
#set text(font: "Libertinus Serif", size: 10.5pt, lang: "en")
#set par(justify: false, leading: 0.55em)

#let header(academy: "The Math Mentor", unit: "G9 Quadratics • 2026-2027", date: datetime.today()) = {
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

#let drawgrid(axisx) = canvas({
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
  line((axisx, lo), (axisx, hi), stroke: (dash: "dashed", thickness: 0.6pt, paint: rgb("#0a9396")))
})

#header()

#align(center)[#text(weight: "bold", size: 11pt)[Chain: one function builds the next skill]]
#v(0.2em)
#align(center)[#text(size: 9pt, fill: rgb("#636e72"))[Main: $f(x) = x^2 - 2x - 3$ #h(1em) Second: $h(x) = -x^2 + 4x - 3$]]
#v(0.6em)

// ===== BLOCK 1: G9-08 standard form =====
#rulebox[
  #align(center, $f(x) = a x^2 + b x + c quad (a != 0)$)
  #v(0.2em)
  $a$ before $x^2$, $b$ before $x$, $c$ alone. Keep signs attached. $c$ is the y-intercept $(0, c)$.
]

#worked("Read a, b, c", (
  ([Form $f(x) = x^2 - 2x - 3$], [Already standard.]),
  ([Values $a = 1$ and $b = -2$], [Signs stay with numbers.]),
  ([Value $c = -3$], [Alone term.]),
  ([Intercept $(0, -3)$], [From c directly.]),
))

#question(1, [
  For $f(x) = x^2 - 2x - 3$: \
  *A (choose):* $a, b, c$ are: (a) $1, -2, -3$ \quad (b) $1, 2, 3$ \quad (c) $1, 2, -3$ \quad (d) $-1, -2, -3$ \
  *B (complete):* y-intercept = \_\_\_\_\_\_.
], points: 2)

#question(2, [
  For $h(x) = -x^2 + 4x - 3$: \
  *A (choose):* $a, b, c$ are: (a) $-1, 4, -3$ \quad (b) $1, 4, -3$ \quad (c) $-1, -4, -3$ \quad (d) $-1, 4, 3$ \
  *B (complete):* y-intercept = \_\_\_\_\_\_.
], points: 2)

// ===== BLOCK 2: G9-09 vertex form =====
#rulebox[
  #align(center, $f(x) = a (x - h)^2 + k quad "vertex" (h, k)$)
  #v(0.2em)
  Complete the square to get there. $(h, k)$ is the same turning point as in Block 3.
]

#worked("Complete the square", (
  ([Start $x^2 - 2x - 3$], [Take $x$ terms only.]),
  ([Half of 2 is 1, square is 1], [Add and subtract 1.]),
  ([Gives $(x - 1)^2 - 1 - 3$], [Factor the square.]),
  ([So $(x - 1)^2 - 4$], [Vertex form found.]),
))

#question(3, [
  *A (choose):* Vertex form of $f$ is: (a) $(x-1)^2 - 4$ \quad (b) $(x+1)^2 - 4$ \quad (c) $(x-1)^2 + 4$ \quad (d) $(x-2)^2 - 3$ \
  *B (complete):* Vertex form of $h(x) = -x^2 + 4x - 3$ is $h(x) =$ \_\_\_\_\_\_\_\_.
], points: 3)

// ===== BLOCK 3: G9-10 vertex + axis =====
#rulebox[
  #align(center, $x_v = -b / (2a) quad "axis:" x = x_v quad y_v = f(x_v)$)
  #v(0.2em)
  Axis cuts through the vertex. $a > 0$ opens up. $a < 0$ opens down.
]

#worked("Vertex of f", (
  ([Step 1: $x_v = 1$], [From $a = 1$ and $b = -2$.]),
  ([Step 2: $y_v = -4$], [Plug back into f.]),
  ([Vertex $(1, -4)$ and axis $x = 1$], [Point plus line.]),
  ([Opens up], [Since $a > 0$.]),
))

#question(4, [
  *A (choose):* Vertex of $f$ is: (a) $(1,-4)$ \quad (b) $(-1,0)$ \quad (c) $(2,-3)$ \quad (d) $(0,-3)$ \
  *B (complete):* Axis $x =$ \_\_\_, opens \_\_\_.
], points: 2)

#question(5, [
  *A (choose):* Vertex of $h(x) = -x^2 + 4x - 3$ is: (a) $(2,1)$ \quad (b) $(1,-4)$ \quad (c) $(-2,1)$ \quad (d) $(2,-1)$ \
  *B (complete):* Axis $x =$ \_\_\_, opens \_\_\_.
], points: 2)

// ===== BLOCK 4: G9-11 + G9-13 table and graph =====
#rulebox[
  #align(center, [Table #sym.arrow plot #sym.arrow join])
  #v(0.2em)
  1) Table with calculator. 2) Plot points. 3) Smooth curve through vertex. Mark vertex, axis, intercepts.
]

#worked("Two rows of f", (
  ([At $x = 3$ the value is $0$], [Order of operations.]),
  ([At $x = -1$ the value is $0$], [Negatives carefully.]),
  ([Plot points plus vertex], [Zeros meet axis.]),
  ([Join smoothly], [Never ruler-straight.]),
))

#question(6, [
  Complete then draw $f(x) = x^2 - 2x - 3$. \
  #v(0.4em)
  #table(
    columns: (auto, auto, auto, auto, auto, auto, auto),
    stroke: 0.5pt,
    [*x*], [$-2$], [$-1$], [$0$], [$1$], [$2$], [$4$],
    [*y*], [$\_\_$], [$\_\_$], [$\_\_$], [$\_\_$], [$\_\_$], [$\_\_$],
  )
  #v(0.3em)
  Mark vertex, axis (dashed), join points.
], figure: drawgrid(1), points: 4)

#question(7, [
  Complete then draw $h(x) = -x^2 + 4x - 3$. \
  #v(0.4em)
  #table(
    columns: (auto, auto, auto, auto, auto, auto),
    stroke: 0.5pt,
    [*x*], [$0$], [$1$], [$2$], [$3$], [$4$],
    [*y*], [$\_\_$], [$\_\_$], [$\_\_$], [$\_\_$], [$\_\_$],
  )
  #v(0.3em)
  Mark vertex, axis (dashed), join points.
], figure: drawgrid(2), points: 4)

// ===== BLOCK 5: G9-12 max/min =====
#rulebox[
  #align(center, [Up gives minimum, down gives maximum, value is $y_v$])
  #v(0.2em)
  Read it at the vertex. Minimum is the lowest point. Maximum is the highest point.
]

#worked("Min and max", (
  ([f opens up], [So it has a minimum.]),
  ([Minimum $y = -4$ at $x = 1$], [Vertex of f.]),
  ([h opens down], [So it has a maximum.]),
  ([Maximum $y = 1$ at $x = 2$], [Vertex of h.]),
))

#question(8, [
  *A (choose):* $f$ has: (a) min $-4$ \quad (b) max $-4$ \quad (c) min $4$ \quad (d) max $3$ \
  *B (choose):* $h$ has: (a) max $1$ \quad (b) min $1$ \quad (c) max $-1$ \quad (d) min $-3$ \
  *C (complete):* $f$ minimum at $x =$ \_\_\_ ; $h$ maximum at $x =$ \_\_\_.
], points: 3)

// ===== BLOCK 6: G9-14/15/16 zeros =====
#rulebox[
  #align(center, [Zeros solve $f(x) = 0$: factor, then zero-product rule])
  #v(0.2em)
  If $(x - p)(x - q) = 0$ then $x = p$ or $x = q$. Check cuts on your graph.
]

#worked("Zeros of f", (
  ([Factor $(x - 3)(x + 1)$], [Product and sum match.]),
  ([Split: $x = 3$ or $x = -1$], [Zero bracket rule.]),
  ([Cuts at those x values], [See Q6 drawing.]),
  ([Same for h below], [Pattern repeats.]),
))

#question(9, [
  *A (essay):* Find zeros of $f$ algebraically, confirm on Q6 graph. \
  *B (essay):* Find zeros of $h(x) = -x^2 + 4x - 3$ by factoring $(-1)$ first, confirm on Q7 graph.
], points: 4)

#question(10, [
  *Number context:* Two numbers differ by $2$ and their product is $-3$. Smaller is $x$. Show $x^2 + 2x - 3 = 0$, find both numbers. \
  *Rectangle context:* A rectangle has length $3$ more than its width and area $10$. Let width be $x$. Show $x^2 + 3x - 10 = 0$, find width and length.
], points: 4)

// ===== EXTENSION: fluency + reading + drill + applied =====
#question(11, [
  New function, same chain: $p(x) = x^2 + 4x + 3$. \
  *A (choose):* $a, b, c$ are: (a) $1, 4, 3$ \quad (b) $1, -4, 3$ \quad (c) $1, 4, -3$ \quad (d) $-1, 4, 3$ \
  *B (choose):* Vertex is: (a) $(-2,-1)$ \quad (b) $(2,1)$ \quad (c) $(-1,0)$ \quad (d) $(0,3)$ \
  *C (complete):* Axis $x =$ \_\_\_, opens \_\_\_, min/max value = \_\_\_.
], points: 3)

#question(12, [
  Read-off (no drawing): $k(x) = x^2 - 4$. \
  *A (choose):* Vertex: (a) $(0,-4)$ \quad (b) $(0,4)$ \quad (c) $(2,0)$ \quad (d) $(-2,0)$ \
  *B (complete):* Axis $x =$ \_\_\_ ; zeros $x =$ \_\_\_ ; minimum $y =$ \_\_\_.
], points: 3)

#question(13, [
  Quick zeros drill (factor, then split): \
  *A:* $x^2 - 5x + 6 = 0$ #h(1em) *B:* $x^2 - 9 = 0$ #h(1em) *C:* $x^2 + 5x + 6 = 0$
], points: 3)

#question(14, [
  *Number context:* Two numbers have sum $7$ and product $10$. Find them. \
  *Rectangle context:* A rectangle has length $2$ more than its width and area $15$. Let width be $x$. Show $x^2 + 2x - 15 = 0$, find width and length.
], points: 4)

// ===== ANSWER KEY: final answers only =====
#block(
  width: 100%, inset: (x: 0.7em, y: 0.6em),
  stroke: (left: 2.5pt + rgb("#d4a373"), rest: 0.5pt + rgb("#e5e7eb")),
  radius: 6pt, fill: rgb("#faf9f6"),
)[
  #text(weight: "bold")[ANSWER KEY: final answers only]
  #v(0.3em)
  Q1: A (a), B $(0,-3)$ #h(1em) Q2: A (a), B $(0,-3)$ \
  Q3: A (a), B $-(x-2)^2 + 1$ \
  Q4: A (a), B $1$, up #h(1em) Q5: A (a), B $2$, down \
  Q6 table: $5, 0, -3, -4, -3, 5$; U through $(1,-4)$, cuts $(-1,0), (3,0)$ \
  Q7 table: $-3, 0, 1, 0, -3$; curve through $(2,1)$, cuts $(1,0), (3,0)$ \
  Q8: A (a), B (a), C $1$ and $2$ \
  Q9: A $3, -1$; B $1, 3$ \
  Q10: numbers $-3$ and $-1$; rectangle width $2$, length $5$ \
  Q11: A (a), B (a), C $-2$, up, $-1$ \
  Q12: A (a), B $0$; $2, -2$; $-4$ \
  Q13: A $2, 3$; B $3, -3$; C $-2, -3$ \
  Q14: numbers $2$ and $5$; rectangle width $3$, length $5$
]
