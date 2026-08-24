#import "@preview/cetz:0.5.2": canvas, draw

#let project(title: "", grade: "", unit: "", body) = {
  set page(paper: "a4", margin: (x: 1.5cm, y: 1.8cm), footer: align(center)[
    #text(8pt, fill: luma(120))[Math Academy — Confidential & Protected]
  ])
  set text(font: "Liberation Sans", size: 10.5pt)
  // Header & Branding Block
  grid(
    columns: (1fr, auto),
    align: (left, right),
    [
      #text(14pt, weight: "bold")[Math Academy] \
      #text(10pt, fill: luma(80))[Grade: #grade | Unit: #unit]
    ],
    [
      #text(10pt, weight: "medium")[Date: #datetime.today().display("[year]-[month]-[day]")] \
      #text(10pt, fill: luma(80))[Student Name: #box(width: 5.5cm, height: 0.9em, stroke: (bottom: 0.5pt + luma(120)))]
    ]
  )
  v(0.5em)
  line(length: 100%, stroke: 1pt + rgb("#0A9396"))
  v(1em)
  align(center)[#text(13pt, weight: "bold", fill: rgb("#1A1A2E"))[#title]]
  v(1em)
  body
}

// Instantiate — OpenCode replaces CONTENT below via math_builder.py
#show: doc => project(
  title: "Worksheet: Inscribed Angles & Circle Theorems",
  grade: "Grade 10",
  unit: "Geometry",
  doc
)

/* CONTENT PLACEHOLDER FOR OPENCODE — builder injects #question blocks here */
#let question(number, body, figure: none, points: 1) = {
  block(width: 100%, inset: (x: 0.6em, y: 0.6em), stroke: (left: 2.5pt + rgb("#0A9396"), rest: 0.5pt + rgb("#0A9396").transparentize(70%)), radius: 6pt, fill: rgb("#FAF9F6"))[
    #text(weight: "bold")[Question #number] #h(0.4em) #text(8pt, fill: rgb("#6b7280"))[(#points pt)] #v(0.4em) #body #if figure != none {v(0.6em); align(center)[#figure]}]
  v(0.7em)
}

#question(1, [In the right-angled triangle $A B C$ below, $angle B = 90 degree$, $A B = 4 "cm"$, $B C = 3 "cm"$. Find $x = angle A$.], figure: canvas({
  import draw: *
  let A=(0,0); let B=(4,0); let C=(4,3)
  line(A,B,C,close:true,stroke:1.3pt)
  content(A,[$A$],anchor:"north-east"); content(B,[$B$],anchor:"north-west"); content(C,[$C$],anchor:"south-west")
}), points: 2)
