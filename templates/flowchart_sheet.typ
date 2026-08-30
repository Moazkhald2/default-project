#import "@preview/cetz:0.5.2": canvas, draw
#import "@preview/cetz:0.5.2" as cetz

#set page(paper: "a4", margin: (x: 1.6cm, y: 1.4cm))
#set text(font: "Libertinus Serif", size: 9.5pt, lang: "en")
#set par(justify: false, leading: 0.5em)

#let header(academy: "Math Academy", unit: "Flowchart • Grade 10", date: datetime.today()) = {
  grid(columns: (1fr, auto), gutter: 1em,
    align(left)[#text(weight: "bold", size: 12pt)[#academy] #h(0.5em) #text(fill: rgb("#6b7280"))[| #unit]],
    align(right)[#text(size: 9pt, fill: rgb("#6b7280"))[#date.display("[year]-[month]-[day]")]],
  )
  line(length: 100%, stroke: 0.6pt + rgb("#e5e7eb"))
  v(0.6em)
  grid(columns: (1fr, 1fr, 1fr), gutter: 0.8em,
    [#text(size: 8.5pt)[Name: #line(length: 5cm, stroke: 0.4pt)]],
    [#text(size: 8.5pt)[Class: #line(length: 3cm, stroke: 0.4pt)]],
    [#text(size: 8.5pt)[Score: #box(width: 2cm, height: 0.9em, stroke: 0.4pt)]],
  )
  v(0.9em)
}

// Flowchart node — kinds: start/step/decision/figure/answer — anchored labels
#let fnode(id, body, kind: "step", points: (0,0), w: 3.2, h: 0.9) = {
  let fill = if kind == "start" { rgb("#111827") } else if kind == "decision" { rgb("#fef3c7") } else if kind == "answer" { rgb("#d1fae5") } else if kind == "figure" { rgb("#f3f4f6") } else { rgb("#ffffff") }
  let stroke = if kind == "start" { rgb("#111827") } else if kind == "decision" { rgb("#f59e0b") } else if kind == "answer" { rgb("#10b981") } else { rgb("#e5e7eb") }
  let txt = if kind == "start" { white } else { rgb("#111827") }
  draw.rect(points, (points.at(0)+w, points.at(1)+h), fill: fill, stroke: stroke + 0.7pt, radius: 4pt)
  draw.content((points.at(0)+w/2, points.at(1)+h/2), text(fill: txt, size: 8pt)[#body], anchor: "center")
  // id tag anchored south-west
  draw.content((points.at(0)+0.12, points.at(1)+0.08), text(size: 5pt, fill: rgb("#9ca3af"))[#id], anchor: "south-west")
}
#let fedge(from, to, label: none) = {
  draw.line(from, to, stroke: 0.7pt + rgb("#6b7280"), mark: (end: ">"))
  if label != none {
    let mx = (from.at(0) + to.at(0))/2
    let my = (from.at(1) + to.at(1))/2
    draw.content((mx, my), text(size: 6pt, fill: rgb("#6b7280"))[#label], anchor: "south", padding: 0.08)
  }
}

// ===== FLOWCHART CONTENT =====
#header(academy: "Math Academy — Flowcharts", unit: "Egypt G7–G9 • First Term", date: datetime.today())

// Example: Quadratic workflow (anchor-precise, CeTZ)
#align(center)[#text(weight: "bold", size: 11pt)[Quadratic — Formula Path]]
#v(0.4em)
#canvas({
  import draw: *
  // spine vertical layout, anchored points
  let s = (1, 4.2)
  let d = (1, 3.2)
  let dec = (1, 2.1)
  let real = (0, 1.0)
  let comp = (2.2, 1.0)
  let chk = (1, 0)
  let ans = (1, -1)

  fnode("start", [$ax^2+bx+c=0$], kind: "start", points: s, w: 2.8, h: 0.7)
  fnode("disc", [$D=b^2-4ac$], kind: "step", points: d)
  fnode("decision", [$D >= 0 ?$], kind: "decision", points: dec)
  fnode("real", [$(-b ± sqrt(D))/2a$], kind: "step", points: real, w: 2.6)
  fnode("complex", [$Complex$], kind: "step", points: comp, w: 2.6)
  fnode("check", [$Check$], kind: "step", points: chk, w: 2.2)
  fnode("answer", [$✓ Verified$], kind: "answer", points: ans, w: 2.2)

  fedge((2.4, 4.2), (2.4, 3.9))
  fedge((2.4, 3.2), (2.4, 2.8))
  fedge((1.6, 2.1), (1.3, 1.7), label: [no])
  fedge((2.8, 2.1), (3.5, 1.7), label: [yes])
  fedge((1.3, 1.0), (2.4, 0.7))
  fedge((3.5, 1.0), (2.4, 0.7))
  fedge((2.4, 0.0), (2.4, -0.3))
})
#v(1em)

// Right Triangle workflow
#align(center)[#text(weight: "bold", size: 11pt)[Right Triangle — tan⁻¹]]
#canvas({
  import draw: *
  let n1 = (1, 3)
  let n2 = (1, 2)
  let n3 = (1, 1)
  let n4 = (1, 0)
  fnode("start", [$\triangle ABC$], kind: "start", points: n1)
  fnode("tan", [$tan A=3/4$], kind: "step", points: n2)
  fnode("fig", [Figure], kind: "figure", points: n3)
  fnode("ans", [$36.87°$], kind: "answer", points: n4)
  fedge((2.6, 3), (2.6, 2.7))
  fedge((2.6, 2), (2.6, 1.7))
  fedge((2.6, 1), (2.6, 0.7))
})
