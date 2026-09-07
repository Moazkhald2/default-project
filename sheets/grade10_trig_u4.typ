#import "@preview/cetz:0.5.2": canvas, draw
#set page(paper: "a4", margin: (x: 1.8cm, y: 1.6cm))
#set text(font: "Libertinus Serif", size: 10.5pt, lang: "en")
#set par(justify: false, leading: 0.55em)
#show heading: set text(weight: "bold")

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

#header(academy: "Math Academy — Grade 10", unit: "Trig U4 Directed + Radian • Calculator allowed", date: datetime.today())
#text(size: 8.5pt, fill: rgb("#6b7280"))[Chain: directed → sign → ±pair → standard → equivalent → smallest → quadrant → radian → conversion → arc → inscribed. 70% basic-medium, 30% high.]

#question(1, [
  The ordered pair $(arrow(O X), arrow(O Y))$ represents the directed angle $angle X O Y$. Identify initial side $arrow(O X)$ and terminal side $arrow(O Y)$.
], points: 1)

#question(2, [
  A directed angle is in standard position if (1) its initial side lies on the positive $x$-axis and (2) its vertex is at the origin $O$.
], points: 1)

#question(3, [
  Directed angles in standard position are equivalent if they have the same terminal side, i.e. measures differ by $n dot 360 degree$, $n in ZZ$.
], points: 1)

#question(4, [
  A directed angle is positive if rotation is counterclockwise, and negative if rotation is clockwise.
], points: 1)

#question(5, [
  If terminal side lies on a coordinate axis, the angle is called a *quadrantal angle* (multiple of $90 degree$).
], points: 1)

#question(6, [
  If $theta$ is a measure and $n in ZZ$, then $theta + n dot 360 degree$ are equivalent angles.
], points: 1)

#question(7, [
  Complete: smallest positive of $530 degree$ is $170 degree$ because $530 degree - 360 degree = 170 degree$.
], points: 1)

#question(8, [
  Complete: $930 degree$ lies in the 3rd quadrant because $930 degree - 720 degree = 210 degree$.
], points: 1)
