#import "@preview/cetz:0.5.2": canvas, draw

#set page(paper: "a4", margin: (x: 1.8cm, y: 1.6cm))
#set text(font: "Libertinus Serif", size: 10.5pt, lang: "en")
#set par(justify: false, leading: 0.55em)

#let header(academy: "The Math Mentor", unit: "G9 Zeros • Simplify • Domain", date: datetime.today()) = {
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

#align(center)[#text(weight: "bold", size: 11pt)[Chain: zeros build simplify, simplify builds domain]]
#v(0.2em)
#align(center)[#text(size: 9pt, fill: rgb("#636e72"))[Part 1: polynomial zeros + fractional simplify + domain. Part 2 preview: codomain, equality, operations.]]
#v(0.6em)

// ===== BLOCK 1: zeros of polynomial =====
#rulebox[
  #align(center, $P(c) = 0 quad "means" c "is a zero / root"$)
  #v(0.2em)
  Factor first, then zero-product: if $(x - p)(x - q) = 0$ then $x = p$ or $x = q$. Never divide by $x$ — you lose $x = 0$.
]

#worked("Zeros by factoring", (
  ([Ex: $P(x) = x^2 + 5x + 6$], [Set $= 0$ to find zeros.]),
  ([Factor $(x + 2)(x + 3) = 0$], [Product and sum match.]),
  ([Split: $x = -2$ or $x = -3$], [Zero-product rule.]),
  ([Check: $(-2)^2 + 5(-2) + 6 = 0$], [Plug back in.]),
))

#question(1, [
  *A (choose):* Zero of $P(x) = 2x + 8$ is: (a) $-4$ \quad (b) $4$ \quad (c) $8$ \quad (d) $-8$ \
  *B (complete):* Show step: $2x + 8 = 0$ gives $x =$ \_\_\_.
], points: 1)

#question(2, [
  *A (choose):* Zeros of $P(x) = x^2 - 5x + 6$ are: (a) $2, 3$ \quad (b) $-2, -3$ \quad (c) $1, 6$ \quad (d) $5, 6$ \
  *B (complete):* Factored form = \_\_\_\_\_\_\_\_.
], points: 1)

#question(3, [
  Zeros of $P(x) = x (x - 4)(x + 1)$ are $x =$ \_\_\_, \_\_\_, \_\_\_.
], points: 1)

#question(4, [
  *A (choose):* Zeros of $P(x) = x^3 - 9x$ are: (a) $0, 3, -3$ \quad (b) $0, 9$ \quad (c) $3, -3$ \quad (d) $9$ only \
  *B (complete):* First step is factor $x$: $x(x^2 - 9) =$ \_\_\_\_\_\_\_\_.
], points: 1)

// ===== BLOCK 2: simplify fractional =====
#rulebox[
  #align(center, $f(x) = P(x) / Q(x) quad Q(x) != 0 quad "restriction first"$)
  #v(0.2em)
  1) Write $Q(x) != 0$. 2) Factor top and bottom. 3) Cancel full factors only, keep restriction. Zeros of $f$ come from top after deleting bottom zeros.
]

#worked("Simplify with restriction", (
  ([Start $f(x) = (x^2 - 4) / (x + 2)$], [Restriction first: $x != -2$.]),
  ([Factor $(x - 2)(x + 2) / (x + 2)$], [Difference of squares.]),
  ([Cancel to $x - 2, x != -2$], [Full factors only.]),
  ([Check $x = 0$: $-2 = -2$], [Both forms agree.]),
))

#question(5, [
  Simplify $f(x) = (x^2 - 25) / (x + 5)$. \
  *A (choose):* Simplified is: (a) $x - 5, x != -5$ \quad (b) $x + 5$ \quad (c) $x - 25$ \quad (d) $x - 5$ with no restriction \
  *B (complete):* Restriction $x != $ \_\_\_.
], points: 2)

#question(6, [
  Simplify $g(x) = (2x^2 + 6x) / (2x)$. \
  *A (complete):* Restriction $x != $ \_\_\_, simplified = \_\_\_\_\_\_. \
  *B (complete):* Zero of $g$ is $x =$ \_\_\_.
], points: 2)

#question(7, [
  Simplify $h(x) = (x^2 + 2x - 8) / (x^2 - 4)$. \
  *A (choose):* Simplified is: (a) $(x + 4)/(x + 2), x != 2, -2$ \quad (b) $(x + 4)/(x + 2)$ no restriction \quad (c) $x + 2$ \quad (d) $2$ \
  *B (complete):* Show factored top = \_\_\_\_\_\_, bottom = \_\_\_\_\_\_.
], points: 2)

// ===== BLOCK 3: domain =====
#rulebox[
  #align(center, ["Domain" = R without {x | Q(x) = 0}])
  #v(0.2em)
  Domain uses bottom only. Set $Q(x) = 0$, factor, exclude. Codomain / range preview: domain = allowed inputs, range = actual outputs — full lesson in Part 2.
]

#worked("Domain of fractional", (
  ([Ex: $g(x) = (x + 1) / (x^2 - 3x + 2)$], [Bottom $= 0$ to find bans.]),
  ([Factor $(x - 1)(x - 2) = 0$], [Zero-product.]),
  ([So $x != 1, x != 2$], [Excluded values.]),
  ([Domain $R \\ {1, 2}$], [All reals minus bans.]),
))

#question(8, [
  Find domain of $f(x) = 3x / (x + 4)$. \
  *A (choose):* Domain is: (a) $R \\ {-4}$ \quad (b) $R \\ {0}$ \quad (c) $R \\ {4}$ \quad (d) all $R$ \
  *B (complete):* Bottom $= 0$ gives $x =$ \_\_\_.
], points: 3)

#question(9, [
  *Time context:* Runner time $T(w) = (w + 10) / (w^2 - 100)$ where $w$ is wind speed. \
  *A (complete):* Not allowed: $w != $ \_\_\_ and \_\_\_. \
  *B (essay):* In one sentence, why are they banned?
], points: 3)

#question(10, [
  Consider $k(x) = (x^2 - 1) / (x - 1)$. \
  *A (complete):* Domain: $x != $ \_\_\_. \
  *B (complete):* Simplified (+ restriction) = \_\_\_\_\_\_\_\_. \
  *C (essay):* Is $x = 1$ a zero? Explain with RULE 1.
], points: 4)

// ===== ANSWER KEY =====
#block(
  width: 100%, inset: (x: 0.7em, y: 0.6em),
  stroke: (left: 2.5pt + rgb("#d4a373"), rest: 0.5pt + rgb("#e5e7eb")),
  radius: 6pt, fill: rgb("#faf9f6"),
)[
  #text(weight: "bold")[ANSWER KEY: final answers only]
  #v(0.3em)
  Q1: A (a), B $-4$ \
  Q2: A (a), B $(x - 2)(x - 3)$ \
  Q3: $0, 4, -1$ \
  Q4: A (a), B $x(x - 3)(x + 3)$ \
  Q5: A (a), B $-5$ \
  Q6: A $x != 0$, $x + 3$; B $-3$ \
  Q7: A (a), B $(x + 4)(x - 2)$, $(x - 2)(x + 2)$ \
  Q8: A (a), B $-4$ \
  Q9: A $10, -10$; B division by zero makes $T$ undefined \
  Q10: A $1$; B $x + 1, x != 1$; C No — top $= 0$ but bottom $= 0$, excluded by RULE 1
]
