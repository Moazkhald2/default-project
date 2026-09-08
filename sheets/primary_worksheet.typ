#import "@preview/cetz:0.5.2": canvas, draw
#set page(paper: "a4", margin: (x: 1.8cm, y: 1.6cm))
#set text(font: "Libertinus Serif", size: 10.5pt, lang: "en")
#set par(justify: false, leading: 0.55em)
#show heading: set text(weight: "bold")

#let header(academy: "Math Academy", unit: "Primary Revision", date: datetime.today()) = {
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

// Grid layout: 3 columns × 10 rows per page
// Each question takes equal width in a 3-column grid
#let gridquestion(number, body) = {
  grid(
    columns: (1fr, 1fr, 1fr),
    gutter: 0.5em,
    [#text(weight: "bold", size: 8pt)[Q#number: #body]],
    [ , , ],
    [ , , ]
  )
  v(0.3em)
}

// ===== PAGE 1: Division Facts (Questions 1-30) =====
#header(academy: "Math Academy — Primary Revision", unit: "Division Facts • Page 1 of 5")

// Row 1
#gridquestion(1, [12 ÷ 3 = ?])
#gridquestion(2, [15 ÷ 5 = ?])
#gridquestion(3, [20 ÷ 4 = ?])
// Row 2
#gridquestion(4, [18 ÷ 6 = ?]))
#gridquestion(5, [24 ÷ 8 = ?]))
#gridquestion(6, [30 ÷ 5 = ?]))
// Row 3
#gridquestion(7, [36 ÷ 6 = ?]))
#gridquestion(8, [40 ÷ 8 = ?]))
#gridquestion(9, [45 ÷ 9 = ?]))
// Row 4
#gridquestion(10, [48 ÷ 6 = ?]))
#gridquestion(11, [56 ÷ 7 = ?]))
#gridquestion(12, [63 ÷ 7 = ?]))
// Row 5
#gridquestion(13, [64 ÷ 8 = ?]))
#gridquestion(14, [72 ÷ 9 = ?]))
#gridquestion(15, [81 ÷ 9 = ?]))
// Row 6
#gridquestion(16, [10 ÷ 2 = ?]))
#gridquestion(17, [14 ÷ 2 = ?]))
#gridquestion(18, [16 ÷ 4 = ?]))
// Row 7
#gridquestion(19, [21 ÷ 3 = ?]))
#gridquestion(20, [25 ÷ 5 = ?]))
#gridquestion(21, [27 ÷ 3 = ?]))
// Row 8
#gridquestion(22, [28 ÷ 4 = ?]))
#gridquestion(23, [32 ÷ 4 = ?]))
#gridquestion(24, [35 ÷ 5 = ?]))
// Row 9
#gridquestion(25, [36 ÷ 4 = ?]))
#gridquestion(26, [42 ÷ 6 = ?]))
#gridquestion(27, [44 ÷ 4 = ?]))
// Row 10
#gridquestion(28, [49 ÷ 7 = ?]))
#gridquestion(29, [54 ÷ 6 = ?]))
#gridquestion(30, [56 ÷ 8 = ?]))