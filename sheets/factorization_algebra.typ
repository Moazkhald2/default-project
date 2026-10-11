#import "@preview/cetz:0.5.2": canvas, draw

#set page(paper: "a4", margin: (x: 1.6cm, y: 1.4cm))
#set text(font: "Libertinus Serif", size: 9.5pt, lang: "en")
#set par(justify: false, leading: 0.55em)
#set block(spacing: 0.7em)

#let header(academy: "The Math Mentor", unit: "Factorization + Algebraic Expressions", date: datetime.today()) = {
  grid(
    columns: (1fr, auto),
    gutter: 1em,
    align(left)[#text(weight: "bold", size: 12pt)[#academy] #h(0.5em) #text(fill: rgb("#6b7280"))[| #unit]],
    align(right)[#text(size: 9pt, fill: rgb("#6b7280"))[#date.display("[year]-[month]-[day]")]],
  )
  line(length: 100%, stroke: 0.6pt + rgb("#e5e7eb"))
  v(0.5em)
  grid(
    columns: (1fr, 1fr, 1fr),
    gutter: 0.8em,
    [#text(size: 9pt)[Name: #line(length: 5cm, stroke: 0.4pt)]],
    [#text(size: 9pt)[Class: #line(length: 3cm, stroke: 0.4pt)]],
    [#text(size: 9pt)[Score: #box(width: 2cm, height: 0.9em, stroke: 0.4pt)]],
  )
  v(0.8em)
}

#let rulebox(body) = {
  block(
    width: 100%, inset: (x: 0.7em, y: 0.6em),
    stroke: (left: 2.5pt + rgb("#0a9396"), rest: 0.5pt + rgb("#e5e7eb")),
    radius: 6pt, fill: rgb("#e6f5f5"),
  )[
    #text(weight: "bold", size: 9.5pt, fill: rgb("#0a9396"))[RULE]
    #v(0.35em)
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
        #text(weight: "bold", size: 9.5pt)[WORKED: #title]
    #v(0.35em)
    #for s in steps {
      block(width: 100%, inset: (left: 0.5em, top: 0.15em, bottom: 0.15em), stroke: (left: 1.5pt + rgb("#0a9396"), rest: none))[
        #align(left)[#s.at(0)]
        #v(0.2em)
        #h(1.5em) #text(size: 9pt, fill: rgb("#636e72"), style: "italic")[#sym.arrow.r.double #s.at(1)]
      ]
      v(0.35em)
    }
  ]
  v(0.6em)
}

#let subhead(code, titletext) = {
  v(0.6em)
  block(
    width: 100%, inset: (x: 0.7em, y: 0.45em),
    stroke: (left: 2pt + rgb("#0a9396"), rest: 0.5pt + rgb("#e5e7eb")),
    radius: 6pt, fill: rgb("#f0fdfa"),
    breakable: false,
  )[
    #text(weight: "bold", size: 10pt)[#code #h(0.3em) #titletext]
  ]
  v(0.35em)
}

#let minirule(body) = {
  text(size: 9pt, fill: rgb("#374151"), style: "italic")[#body]
  v(0.35em)
}

#let question(number, body, figure: none, points: 1) = {
  block(
    width: 100%, inset: (x: 0.7em, y: 0.6em),
    stroke: (left: 2pt + rgb("#111827"), rest: 0.5pt + rgb("#e5e7eb")),
    radius: 6pt, fill: rgb("#ffffff"),
    breakable: false,
  )[
    #text(weight: "bold")[Question #number] #h(0.4em) #text(size: 8.5pt, fill: rgb("#6b7280"))[(#points pt)]
    #v(0.35em)
    #body
    #if figure != none {
      v(0.5em)
      align(center)[#figure]
    }
  ]
  v(0.6em)
}

#let challhead(titletext) = {
  v(0.6em)
  block(
    width: 100%, inset: (x: 0.7em, y: 0.6em),
    stroke: (left: 3pt + rgb("#9d0208"), rest: 0.7pt + rgb("#9d0208")),
    radius: 6pt, fill: rgb("#fff1f1"),
    breakable: false,
  )[
    #text(weight: "bold", size: 11pt, fill: rgb("#9d0208"))[#titletext]
  ]
  v(0.5em)
}

#let challbadge() = {
  box(inset: (x: 0.5em, y: 0.25em), radius: 4pt, fill: rgb("#9d0208"))[
    #text(weight: "bold", size: 8.5pt, fill: white)[CHALLENGE]
  ]
}

#let worklines(n: 4) = {
  v(0.35em)
  for _ in range(n) {
    line(length: 100%, stroke: 0.4pt + rgb("#cbd5e1"))
    v(0.5em)
  }
}

#header()

// ===== BLOCK 1 — Like terms =====
#rulebox[
  #align(center, $x + x = 2x quad 3x + 5x = 8x quad "only same letters + powers combine"$)
  #v(0.2em)
  Like terms share letters and powers. Add or subtract their numbers (coefficients). Unlike terms like $x$ and $x^2$ never merge.
]

#subhead("B1a", [— single-side combine (easiest)])
#minirule[Same letter on one side: just add the numbers in front.]
#worked("Simplify 3a + 5a", (
  ([$3a + 5a$], [Same letter $a$, so numbers can add.]),
  ([$3 + 5 = 8$], [Add coefficients only.]),
  ([$8a$], [Reattach the letter.]),
))
#question(1, [
  *TRY (B1a):* $4y + 6y =$ \
  #h(1.5em) (a) $10y$ \
  #h(1.5em) (b) $10y^2$ \
  #h(1.5em) (c) $24y$ \
  #h(1.5em) (d) $10$ \
  #v(0.35em)
  *B:* $7p + 2p =$ \_\_\_\_ ; $9k - 4k =$ \_\_\_\_.
], points: 2)

#subhead("B1b", [— two-sided group (medium)])
#minirule[Letters one pile, plain numbers another pile, then add each pile.]
#worked("Simplify 4x + 7 + 2x - 3", (
  ([$4x + 2x + 7 - 3$], [Group x-terms, group numbers.]),
  ([$6x + 4$], [Add each group separately.]),
  ([$6x$ and $4$ stay apart], [Unlike kinds never mix.]),
))
#question(2, [
  *TRY (B1b):* $5y + 3 + 3y - 1 =$ \
  #h(1.5em) (a) $8y + 2$ \
  #h(1.5em) (b) $8y + 4$ \
  #h(1.5em) (c) $9y$ \
  #h(1.5em) (d) $6y + 3$ \
  #v(0.35em)
  *B:* Group first: $5y + 3y =$ \_\_\_ ; $3 - 1 =$ \_\_\_ ; final \_\_\_\_\_\_\_\_.
], points: 2)

#subhead("B1c", [— with powers (harder)])
#minirule[Powers must match exactly: $a^2$ only joins $a^2$, never plain $a$.]
#question(3, [
  *TRY (B1c):* $2a^2 + 3a^2 - a^2 =$ \
  #h(1.5em) (a) $4a^2$ \
  #h(1.5em) (b) $5a^2$ \
  #h(1.5em) (c) $4a$ \
  #h(1.5em) (d) $6a^2$ \
  #v(0.35em)
  *B:* $3x + 2x^2 + 4x =$ \_\_\_\_\_\_\_\_ (hint: only the $x$ terms join).
], points: 2)

// ===== BLOCK 2 — Single bracket =====
#rulebox[
  #align(center, $a(b + c) = a b + a c quad "multiply outside into EVERY term inside"$)
  #v(0.2em)
  Distributive law. Watch the sign: $-(b - c) = -b + c$. Multiply numbers and keep letters.
]

#subhead("B2a", [— positive outside (easiest)])
#minirule[Positive outside: hit each inside term once, keep signs.]
#worked("Expand 3(x + 4)", (
  ([$3 times x = 3x$], [Outside times first term.]),
  ([$3 times 4 = 12$], [Outside times second term.]),
  ([$3x + 12$], [Join with the bracket sign.]),
))
#question(4, [
  *TRY (B2a):* $4(y + 5) =$ \
  #h(1.5em) (a) $4y + 5$ \
  #h(1.5em) (b) $4y + 20$ \
  #h(1.5em) (c) $9y$ \
  #h(1.5em) (d) $y + 20$ \
  #v(0.35em)
  *B:* $2(a + 6) =$ \_\_\_\_\_\_\_\_.
], points: 2)

#subhead("B2b", [— negative outside (medium)])
#minirule[Negative outside flips every inside sign as you multiply.]
#worked("Expand -2(2y - 5)", (
  ([$-2 times 2y = -4y$], [Negative times positive stays negative.]),
  ([$-2 times (-5) = +10$], [Negative times negative turns positive.]),
  ([$-4y + 10$], [Join the two hits.]),
))
#question(5, [
  *TRY (B2b):* $5(a - 2) =$ \
  #h(1.5em) (a) $5a - 10$ \
  #h(1.5em) (b) $5a - 2$ \
  #h(1.5em) (c) $3a$ \
  #h(1.5em) (d) $5a + 10$ \
  #v(0.35em)
  *B:* $-3(b - 4) =$ \_\_\_\_\_\_\_\_ (show both multiplications).
], points: 2)

#subhead("B2c", [— variable outside (harder)])
#minirule[Letter outside adds powers: $x times x = x^2$.]
#question(6, [
  *TRY (B2c):* $x(x + 7) =$ \
  #h(1.5em) (a) $x^2 + 7x$ \
  #h(1.5em) (b) $x^2 + 7$ \
  #h(1.5em) (c) $2x + 7$ \
  #h(1.5em) (d) $x + 7x$ \
  #v(0.35em)
  *B:* $2y(y - 3) =$ \_\_\_\_\_\_\_\_.
], points: 2)

// ===== BLOCK 3 — Double bracket (FOIL) =====
#rulebox[
  #align(center, $(x + a)(x + b) = x^2 + (a + b) x + a b quad "FOIL: First, Outer, Inner, Last"$)
  #v(0.2em)
  Every term left hits every term right. Collect the two middle $x$-terms into one.
]

#subhead("B3a", [— both plus (easiest)])
#minirule[Plus-plus: all four hits positive, middles add.]
#worked("Expand (x + 3)(x + 5)", (
  ([$x times x = x^2$], [First hits First.]),
  ([$5x + 3x = 8x$], [Outer plus Inner combine.]),
  ([$3 times 5 = 15$], [Last hits Last.]),
  ([$x^2 + 8x + 15$], [Join: square + middle + plain.]),
))
#question(7, [
  *TRY (B3a):* $(x + 2)(x + 6) =$ \
  #h(1.5em) (a) $x^2 + 8x + 12$ \
  #h(1.5em) (b) $x^2 + 6x + 12$ \
  #h(1.5em) (c) $2x + 8$ \
  #h(1.5em) (d) $x^2 + 12x + 8$ \
  #v(0.35em)
  *B:* Middle: $6x + 2x =$ \_\_\_ ; last: $2 times 6 =$ \_\_\_ ; final \_\_\_\_\_\_\_\_.
], points: 2)

#subhead("B3b", [— with minus (medium)])
#minirule[Minus flips that hit: Outer/Inner take the sign of their own pair.]
#question(8, [
  *TRY (B3b):* $(x - 3)(x + 5) =$ \
  #h(1.5em) (a) $x^2 + 2x - 15$ \
  #h(1.5em) (b) $x^2 - 2x - 15$ \
  #h(1.5em) (c) $x^2 + 8x - 15$ \
  #h(1.5em) (d) $2x - 15$ \
  #v(0.35em)
  *B:* Middle: $-3x + 5x =$ \_\_\_ ; last: $(-3)(5) =$ \_\_\_ ; final \_\_\_\_\_\_\_\_.
], points: 2)

#subhead("B3c", [— leading coeff (harder)])
#minirule[With $2x$ in front, First gives $2x^2$; Outer + Inner must still hit $b x$.]
#question(9, [
  *TRY (B3c):* $(2x - 1)(x + 4) =$ \
  #h(1.5em) (a) $2x^2 + 7x - 4$ \
  #h(1.5em) (b) $2x^2 + 8x - 4$ \
  #h(1.5em) (c) $2x^2 - 7x - 4$ \
  #h(1.5em) (d) $3x + 3$ \
  #v(0.35em)
  *B:* Check Outer + Inner $= 8x - x =$ \_\_\_ ; last $=(-1)(4) =$ \_\_\_.
], points: 2)

// ===== BLOCK 4 — Square of a bracket =====
#rulebox[
  #align(center, $(x plus.minus a)^2 = x^2 plus.minus 2a x + a^2 quad "square = self-times: middle doubles"$)
  #v(0.2em)
  A square is the bracket written twice. The middle term is always twice the product.
]

#subhead("B4a", [— plus square (easiest)])
#minirule[Plus square: write twice, FOIL, middle doubles positive.]
#worked("Expand (x + 3)^2", (
  ([$(x + 3)(x + 3)$], [Write the square out twice.]),
  ([$x^2 + 3x + 3x + 9$], [FOIL gives twin middles.]),
  ([$x^2 + 6x + 9$], [Twins merge; last $(3)(3) = 9$.]),
))
#question(10, [
  *TRY (B4a):* $(x + 4)^2 =$ \
  #h(1.5em) (a) $x^2 + 8x + 16$ \
  #h(1.5em) (b) $x^2 + 4x + 16$ \
  #h(1.5em) (c) $x^2 - 8x + 16$ \
  #h(1.5em) (d) $x^2 + 8x + 8$ \
  #v(0.35em)
  *B:* Middle double: $4x + 4x =$ \_\_\_ ; last: $(4)(4) =$ \_\_\_.
], points: 2)
#subhead("B4b/c", [— minus squares (harder)])
#minirule[Minus square: middles stay negative, last still positive.]
#question(11, [
  *TRY (B4b):* $(x - 3)^2 =$ \
  #h(1.5em) (a) $x^2 - 6x + 9$ \
  #h(1.5em) (b) $x^2 - 3x + 9$ \
  #h(1.5em) (c) $x^2 + 6x + 9$ \
  #h(1.5em) (d) $x^2 - 6x - 9$ \
  #v(0.35em)
  *B (B4c):* $(y - 4)^2 =$ \
  #h(1.5em) (a) $y^2 - 8y + 16$ \
  #h(1.5em) (b) $y^2 - 4y + 16$ \
  #h(1.5em) (c) $y^2 + 8y + 16$ \
  #h(1.5em) (d) $y^2 - 8y - 16$ \
  #v(0.35em)
  *C:* Middle double: \_\_\_ ; last: $(-4)(-4) =$ \_\_\_.
], points: 2)

// ===== BLOCK 5 — Adding / subtracting brackets =====
#rulebox[
  #align(center, [Collect like with like; minus before a bracket flips EVERY sign inside])
  #v(0.2em)
  $8x - (3x - 2) = 8x - 3x + 2$. Plus-bracket changes nothing.
]

#subhead("B5a", [— plus-bracket, no flip (easiest)])
#minirule[Plus in front: drop brackets, nothing changes.]
#worked("Simplify (7x + 5) + (3x - 2)", (
  ([$7x + 5 + 3x - 2$], [Plus-bracket: copy signs as-is.]),
  ([$7x + 3x = 10x$], [Collect the x-group.]),
  ([$10x + 3$], [Collect numbers $5 - 2 = 3$.]),
))
#question(12, [
  *TRY (B5a):* $(4a + 3) + (2a - 1) =$ \
  #h(1.5em) (a) $6a + 2$ \
  #h(1.5em) (b) $6a + 4$ \
  #h(1.5em) (c) $2a + 2$ \
  #h(1.5em) (d) $6a - 1$ \
  #v(0.35em)
  *B:* Collect $4a + 2a =$ \_\_\_ ; $3 - 1 =$ \_\_\_.
], points: 2)
#subhead("B5b", [— minus flip (medium)])
#minirule[Minus in front flips every sign; then collect like B1b.]
#worked("Simplify (7x + 5) - (3x - 2)", (
  ([$7x + 5 - 3x + 2$], [Minus flips $-3x$ and $-2$.]),
  ([$7x - 3x = 4x$], [Collect the x-group.]),
  ([$5 + 2 = 7$], [Collect the number group.]),
  ([$4x + 7$], [Join the two groups.]),
))
#question(13, [
  *TRY (B5b):* $(9y + 6) - (4y - 3) =$ \
  #h(1.5em) (a) $5y + 3$ \
  #h(1.5em) (b) $5y + 9$ \
  #h(1.5em) (c) $13y + 3$ \
  #h(1.5em) (d) $5y - 9$ \
  #v(0.35em)
  *B:* Flipped middle: $9y - 4y =$ \_\_\_ ; $6 + 3 =$ \_\_\_.
], points: 2)
#subhead("B5c", [— mixed 2x (harder)])
#minirule[Same flip, now with $2x$ and a plus-inside: still flip every sign.]
#question(14, [
  *TRY (B5c):* $(6x + 1) - (2x + 5) =$ \
  #h(1.5em) (a) $4x - 4$ \
  #h(1.5em) (b) $4x + 6$ \
  #h(1.5em) (c) $8x - 4$ \
  #h(1.5em) (d) $4x + 4$ \
  #v(0.35em)
  *B:* Flipped: $6x - 2x =$ \_\_\_ ; $1 - 5 =$ \_\_\_.
], points: 2)

// ===== BLOCK 6 — Common factor + grouping =====
#rulebox[
  #align(center, [Common factor = reverse expanding: take out the biggest shared number #sym.times letter])
  #v(0.2em)
  $6x + 9 = 3(2x + 3)$. Grouping: pair terms, factor each pair, then factor the shared bracket. Expand to check.
]

#subhead("B6a", [— numbers only (easiest)])
#minirule[Biggest shared number goes outside; divide each term.]
#worked("Factorise 6x + 9", (
  ([$"HCF"(6, 9) = 3$], [Biggest shared number.]),
  ([$3(2x + 3)$], [Divide each term by 3.]),
  ([Check: $3(2x+3) = 6x + 9$], [Expand to verify.]),
))
#question(15, [
  *TRY (B6a):* $8y + 12 =$ \
  #h(1.5em) (a) $4(2y + 3)$ \
  #h(1.5em) (b) $8(y + 12)$ \
  #h(1.5em) (c) $2(4y + 12)$ \
  #h(1.5em) (d) $4(2y + 12)$ \
  #v(0.35em)
  *B:* HCF of $8$ and $12$ is \_\_\_ ; check by expanding (a).
], points: 2)

#subhead("B6b", [— with powers (medium)])
#minirule[Also take shared letters: $4x^2 - 8x = 4x(x - 2)$.]
#question(16, [
  *TRY (B6b):* $4x^2 - 8x =$ \
  #h(1.5em) (a) $4x(x - 2)$ \
  #h(1.5em) (b) $4(x^2 - 8x)$ \
  #h(1.5em) (c) $2x(2x - 8)$ \
  #h(1.5em) (d) $x(4x - 8)$ \
  #v(0.35em)
  *B:* HCF of $10a$ and $15$ is \_\_\_ ; $10a + 15 = 5($\_\_\_\_\_\_$)$.
], points: 2)

#subhead("B6c", [— grouping four terms (harder)])
#minirule[Pair up, factor each pair, then pull the shared bracket.]
#worked("Factorise x^2 + 3x + 2x + 6", (
  ([$x(x + 3) + 2(x + 3)$], [Factor each pair separately.]),
  ([$(x + 3)$ is shared], [Same bracket in both halves.]),
  ([$(x + 3)(x + 2)$], [Pull the shared bracket out.]),
))
#question(17, [
  *TRY (B6c):* $x^2 + 5x + 3x + 15 =$ \
  #h(1.5em) (a) $(x + 5)(x + 3)$ \
  #h(1.5em) (b) $(x + 5)(x + 5)$ \
  #h(1.5em) (c) $x(x + 8) + 15$ \
  #h(1.5em) (d) $(x + 3)(x + 3)$ \
  #v(0.35em)
  *B:* First pairs: $x(x + 5) + $\_\_\_ $(x + 5)$; final \_\_\_\_\_\_\_\_.
], points: 2)

// ===== BLOCK 7 — Trinomial + squares =====
#rulebox[
  #align(center, $x^2 + b x + c = (x + m)(x + n) "with" m n = c, m + n = b quad a^2 - b^2 = (a - b)(a + b)$)
  #v(0.2em)
  Plain trinomial: two numbers that multiply to $c$ and add to $b$. Difference of squares: root each side, one minus one plus.
]

#subhead("B7a", [— positive trinomial (easiest)])
#minirule[Both plus: find two positives that multiply to $c$ and add to $b$.]
#worked("Factorise x^2 + 5x + 6", (
  ([$2 times 3 = 6, 2 + 3 = 5$], [Pair for the trinomial.]),
  ([$(x + 2)(x + 3)$], [Signs follow $+5, +6$.]),
  ([Check by FOIL], [Must give back start.]),
))
#question(18, [
  *TRY (B7a):* $x^2 + 7x + 12 =$ \
  #h(1.5em) (a) $(x+3)(x+4)$ \
  #h(1.5em) (b) $(x+2)(x+6)$ \
  #h(1.5em) (c) $(x-3)(x-4)$ \
  #h(1.5em) (d) $(x+7)(x+1)$ \
  #v(0.35em)
  *B:* Pair check: $3 times 4 =$ \_\_\_ ; $3 + 4 =$ \_\_\_.
], points: 2)
#subhead("B7b", [— negative c (medium)])
#minirule[Negative $c$ means opposite signs: product negative, sum keeps bigger-sign.]
#question(19, [
  *TRY (B7b):* $x^2 + 2x - 15 =$ \
  #h(1.5em) (a) $(x+5)(x-3)$ \
  #h(1.5em) (b) $(x-5)(x+3)$ \
  #h(1.5em) (c) $(x+5)(x+3)$ \
  #h(1.5em) (d) $(x-5)(x-3)$ \
  #v(0.35em)
  *B:* Pair: $5 times (-3) =$ \_\_\_ ; $5 - 3 =$ \_\_\_.
], points: 2)
#subhead("B7c", [— difference of squares (harder)])
#minirule[Squares need roots with minus-plus: $a^2 - b^2 = (a-b)(a+b)$.]
#question(20, [
  *TRY (B7c):* $x^2 - 25 =$ \
  #h(1.5em) (a) $(x-5)(x+5)$ \
  #h(1.5em) (b) $(x-5)(x-5)$ \
  #h(1.5em) (c) $(x+5)(x+5)$ \
  #h(1.5em) (d) $(x-25)(x+1)$ \
  #v(0.35em)
  *B:* $y^2 - 16 = (y $\_\_\_ $4)(y $\_\_\_ $4)$; final \_\_\_\_\_\_\_\_.
], points: 2)

// ===== BLOCK 8 — Hard: ax^2 + bx + c, perfect square, mixed =====
#rulebox[
  #align(center, [$a x^2 + b x + c$: trial pair for $a$ #sym.times trial pair for $c$, Outer + Inner must hit $b$])
  #v(0.2em)
  Leading $a > 1$ needs FOIL-backwards. Perfect square: $x^2 + 6x + 9 = (x+3)^2$. Always pull a common factor FIRST.
]

#subhead("B8a", [— leading coeff (medium)])
#minirule[Split $a x^2$, split $c$, tune until Outer + Inner $= b x$.]
#worked("Factorise 2x^2 + 7x + 3", (
  ([$(2x + 1)(x + 3)$], [Split $2x^2$; $1 times 3 = 3$.]),
  ([Outer + Inner $= 6x + x = 7x$], [Middle must match $7x$.]),
  ([Check by expanding], [FOIL must give back start.]),
))
#question(21, [
  *TRY (B8a):* $3x^2 + 8x + 4 =$ \
  #h(1.5em) (a) $(3x+2)(x+2)$ \
  #h(1.5em) (b) $(3x+4)(x+1)$ \
  #h(1.5em) (c) $(3x-2)(x-2)$ \
  #h(1.5em) (d) $(x+2)(x+4)$ \
  #v(0.35em)
  *B:* Outer + Inner $= 6x + 2x =$ \_\_\_ ; last $= (2)(2) =$ \_\_\_.
], points: 2)
#subhead("B8b", [— more trials + squares (harder)])
#minirule[Try more pairs for $a x^2 + b x + c$; squares need roots with minus-plus.]
#question(22, [
  *TRY (B8b):* $3x^2 - 5x - 2 =$ \
  #h(1.5em) (a) $(3x+1)(x-2)$ \
  #h(1.5em) (b) $(3x-1)(x+2)$ \
  #h(1.5em) (c) $(3x-2)(x-1)$ \
  #h(1.5em) (d) $(x-2)(x+1)$ \
  #v(0.35em)
  *B:* $4y^2 - 25 = (2y $\_\_\_ $5)(2y $\_\_\_ $5)$; final \_\_\_\_\_\_\_\_.
], points: 2)
#subhead("B8c", [— perfect square + factor-first (hardest)])
#minirule[Square pattern $4x^2 + 12x + 9 = (2x+3)^2$; mixed? factor first.]
#question(23, [
  *TRY (B8c):* $4x^2 + 12x + 9 =$ \
  #h(1.5em) (a) $(2x+3)^2$ \
  #h(1.5em) (b) $(2x-3)^2$ \
  #h(1.5em) (c) $(4x+3)(x+3)$ \
  #h(1.5em) (d) $(2x+9)(2x+1)$ \
  #v(0.35em)
  *B:* $6x^2 + 9x + 3 = 3($\_\_\_\_\_\_\_\_$)$; then factor inside if possible.
], points: 2)

// ===== BLOCK 9 — Simple common factor (extra starters) =====
#subhead("B9a", [— numbers only (starter)])
#minirule[Biggest shared number goes outside; divide each term inside.]
#worked("Factorise 10x + 15", (
  ([$"HCF"(10, 15) = 5$], [Biggest shared number.]),
  ([$5(2x + 3)$], [Divide each term by 5.]),
  ([Check: $5(2x + 3) = 10x + 15$], [Expand to verify.]),
))
#question(24, [
  *TRY (B9a):* $12y + 18 =$ \
  #h(1.5em) (a) $6(2y + 3)$ \
  #h(1.5em) (b) $12(y + 18)$ \
  #h(1.5em) (c) $2(6y + 18)$ \
  #h(1.5em) (d) $6(2y + 18)$ \
  #v(0.35em)
  *B:* HCF of $12$ and $18$ is \_\_\_ ; check by expanding (a).
], points: 2)

#subhead("B9b", [— with powers])
#minirule[Take the biggest number times the smallest shared power of $x$.]
#worked("Factorise 6x^2 + 9x", (
  ([$"HCF" = 3x$], [Numbers $3$, letters $x$ shared.]),
  ([$3x(2x + 3)$], [Divide each term by $3x$.]),
  ([Check: $3x(2x + 3) = 6x^2 + 9x$], [Expand to verify.]),
))
#question(25, [
  *TRY (B9b):* $8x^2 + 12x =$ \
  #h(1.5em) (a) $4x(2x + 3)$ \
  #h(1.5em) (b) $4(2x^2 + 12x)$ \
  #h(1.5em) (c) $2x(4x + 12)$ \
  #h(1.5em) (d) $8(x^2 + 12x)$ \
  #v(0.35em)
  *B:* $9y^2 + 6y = 3y($\_\_\_\_\_\_$)$; inside $=$ \_\_\_\_\_\_\_\_.
], points: 2)

#subhead("B9c", [— two letters])
#minirule[Shared letters go out too: $4a b + 8a = 4a(b + 2)$ — divide each term by $4a$.]
#question(26, [
  *TRY (B9c):* $4a b + 8a =$ \
  #h(1.5em) (a) $4a(b + 2)$ \
  #h(1.5em) (b) $4(a b + 8a)$ \
  #h(1.5em) (c) $2a(2b + 8)$ \
  #h(1.5em) (d) $a(4b + 8)$ \
  #v(0.35em)
  *B:* $6x y + 9y = 3y($\_\_\_\_\_\_$)$; check by expanding (a).
], points: 2)

// ===== BLOCK 10 — Simple grouping =====
#subhead("B10a", [— 4-term no coeff (starter)])
#minirule[Pair terms, factor each pair, then pull the shared bracket.]
#worked("Factorise x^2 + 3x + 2x + 6", (
  ([$x(x + 3) + 2(x + 3)$], [Factor each pair separately.]),
  ([$(x + 3)$ is shared], [Same bracket in both halves.]),
  ([$(x + 3)(x + 2)$], [Pull the shared bracket out.]),
))
#question(27, [
  *TRY (B10a):* $x^2 + 4x + 3x + 12 =$ \
  #h(1.5em) (a) $(x + 4)(x + 3)$ \
  #h(1.5em) (b) $(x + 4)(x + 4)$ \
  #h(1.5em) (c) $x(x + 7) + 12$ \
  #h(1.5em) (d) $(x + 3)(x + 3)$ \
  #v(0.35em)
  *B:* First pairs: $x(x + 4) + 3(x + 4)$; final \_\_\_\_\_\_\_\_.
], points: 2)

#subhead("B10b/c", [— with numbers + check-by-expand])
#minirule[Same pairing with bigger numbers; always expand your answer to check.]
#question(28, [
  *TRY (B10b):* $2x^2 + 4x + 3x + 6 =$ \
  #h(1.5em) (a) $(x + 2)(2x + 3)$ \
  #h(1.5em) (b) $(x + 2)(2x + 2)$ \
  #h(1.5em) (c) $2x(x + 4) + 3x + 6$ \
  #h(1.5em) (d) $(x + 3)(2x + 1)$ \
  #v(0.35em)
  *B (B10c check):* Expand \((x + 3)(x + 2)\): middle + outer = 5x; last = 6; final x-squared + 5x + 6.
], points: 2)

// ===== BLOCK 11 — Difference of two squares (expanded) =====
#subhead("B11a", [— pure squares])
#minirule[Root each side: $a^2 - b^2 = (a - b)(a + b)$ — one minus, one plus.]
#worked("Factorise x^2 - 25", (
  ([$sqrt(x^2) = x, sqrt(25) = 5$], [Root each square side.]),
  ([$(x - 5)(x + 5)$], [Minus-bracket plus-bracket.]),
  ([Check by FOIL], [Must give back $x^2 - 25$.]),
))
#question(29, [
  *TRY (B11a):* $y^2 - 36 =$ \
  #h(1.5em) (a) $(y - 6)(y + 6)$ \
  #h(1.5em) (b) $(y - 6)(y - 6)$ \
  #h(1.5em) (c) $(y + 6)(y + 6)$ \
  #h(1.5em) (d) $(y - 36)(y + 1)$ \
  #v(0.35em)
  *B:* Roots: $y$ and \_\_\_ ; final \_\_\_\_\_\_\_\_.
], points: 2)

#subhead("B11b/c", [— coeff squares + factor-first])
#minirule[Root numbers and letters; if a common factor exists, take it FIRST, then the squares.]
#worked("Factorise 4x^2 - 9", (
  ([$sqrt(4x^2) = 2x, sqrt(9) = 3$], [Root each side incl. coeff.]),
  ([$(2x - 3)(2x + 3)$], [Minus-bracket plus-bracket.]),
  ([Check by FOIL], [Middle cancels, last $-9$.]),
))
#question(30, [
  *TRY (B11b):* $9y^2 - 16 =$ \
  #h(1.5em) (a) $(3y - 4)(3y + 4)$ \
  #h(1.5em) (b) $(3y - 4)(3y - 4)$ \
  #h(1.5em) (c) $(9y - 4)(y + 4)$ \
  #h(1.5em) (d) $(3y + 4)^2$ \
  #v(0.35em)
  *B (B11c):* $25m^2 - 49n^2 =$ \
  #h(1.5em) (a) $(5m - 7n)(5m + 7n)$ \
  #h(1.5em) (b) $(5m - 7n)^2$ \
  #h(1.5em) (c) $(25m - 49n)(m + n)$ \
  #h(1.5em) (d) $(5m + 7n)^2$ \
  #v(0.35em)
  *C:* $3x^2 - 27 = 3(x^2 - 9) = 3(x $\_\_\_ $3)(x $\_\_\_ $3)$.
], points: 2)

// ===== BLOCK 12 — Sum / difference of two cubes (intro simple only) =====
#rulebox[
  #align(center, $a^3 + b^3 = (a + b)(a^2 - a b + b^2) quad a^3 - b^3 = (a - b)(a^2 + a b + b^2)$)
  #v(0.2em)
  Cube-root each side, one small bracket, one long trinomial; signs follow SOAP pattern.
]
#subhead("B12a", [— difference of cubes])
#minirule[Cube-root each side, then fill $(a - b)(a^2 + a b + b^2)$.]
#worked("Factorise x^3 - 8", (
  ([$a = x, b = 2$ since $2^3 = 8$], [Cube-root each side.]),
  ([$(x - 2)(x^2 + 2x + 4)$], [Minus, then $+ +$ in trinomial.]),
  ([Check: middle signs $+ +$], [Difference pattern keeps plus inside.]),
))
#subhead("B12b/c", [— sum + factor-first numeric check])
#minirule[Sum uses $(a + b)(a^2 - a b + b^2)$; with a common number, factor it first.]
#worked("Factorise x^3 + 64", (
  ([$a = x, b = 4$ since $4^3 = 64$], [Cube-root each side.]),
  ([$(x + 4)(x^2 - 4x + 16)$], [Plus, then $- +$ in trinomial.]),
  ([Check middle sign is minus], [Sum pattern flips middle to minus.]),
))
#question(31, [
  *TRY (B12a):* $y^3 - 27 =$ \
  #h(1.5em) (a) $(y - 3)(y^2 + 3y + 9)$ \
  #h(1.5em) (b) $(y - 3)(y^2 - 3y + 9)$ \
  #h(1.5em) (c) $(y + 3)(y^2 - 3y + 9)$ \
  #h(1.5em) (d) $(y - 3)^3$ \
  #v(0.35em)
  *B (B12b):* $m^3 + 1 =$ \
  #h(1.5em) (a) $(m + 1)(m^2 - m + 1)$ \
  #h(1.5em) (b) $(m + 1)(m^2 + m + 1)$ \
  #h(1.5em) (c) $(m - 1)(m^2 + m + 1)$ \
  #h(1.5em) (d) $(m + 1)^3$ \
  #v(0.35em)
  *C (B12c factor-first):* \(2x^3 - 16 = 2(x^3 - 8) = 2(x - 2)(x^2 + 2x + 4)\); fill blanks: (x \_\_\_ 2) and (x-squared + 2x + \_\_\_); check \(x = 2\) gives 0.
], points: 2)

// ===== CHALLENGE — Hard Mix (starred) =====
#challhead([CHALLENGE — Hard Mix (starred) · free response · show full working])

#question("C1", [
  #challbadge() #h(0.5em) *Factor-first + squares (free response).*
  #v(0.35em)
  (a) Factorise fully: $2x^2 - 18$. \
  #h(1.5em) Hint: take the common number out FIRST, then look for squares. \
  #worklines(n: 3)
  #v(0.35em)
  (b) Harder: factorise fully $3x^3 - 27x$. \
  #h(1.5em) Hint: factor $3x$ first — what is left inside? \
  #worklines(n: 4)
], points: 3)

#question("C2", [
  #challbadge() #h(0.5em) *Hard trinomial $a x^2 + b x + c$ (free response).*
  #v(0.35em)
  Factorise fully: $6x^2 + 11x + 3$. \
  #h(1.5em) Hint: split $6x^2$ as $(3x + ?)(2x + ?)$ or $(6x + ?)(x + ?)$; tune until Outer + Inner $= 11x$. \
  #worklines(n: 4)
  #v(0.35em)
  Check: expand your answer to confirm you get back $6x^2 + 11x + 3$. \
  #worklines(n: 2)
], points: 3)

#question("C3", [
  #challbadge() #h(0.5em) *Cubes combo (free response).*
  #v(0.35em)
  (a) Factorise: $x^3 - 27$ (difference of cubes). \
  #h(1.5em) Hint: cube-roots are $x$ and $3$; use $(a - b)(a^2 + a b + b^2)$. \
  #worklines(n: 3)
  #v(0.35em)
  (b) Factorise: $64m^3 + 1$ (sum of cubes). \
  #h(1.5em) Hint: cube-roots are $4m$ and $1$; use $(a + b)(a^2 - a b + b^2)$. \
  #worklines(n: 3)
], points: 3)

#question("C4", [
  #challbadge() #h(0.5em) *Grouping + repeated squares (free response).*
  #v(0.35em)
  (a) Factorise by grouping: $3x^2 + 6x + 2x + 4$. \
  #h(1.5em) Hint: factor $3x$ from the first pair, $2$ from the second pair, then pull the shared bracket. \
  #worklines(n: 3)
  #v(0.35em)
  (b) Factorise fully: $x^4 - 16$ (difference of squares TWICE). \
  #h(1.5em) Hint: first $(x^2 - 4)(x^2 + 4)$, then factor $(x^2 - 4)$ again. \
  #worklines(n: 3)
], points: 3)

#question("C5", [
  #challbadge() #h(0.5em) *Application: area to sides (free response).*
  #v(0.35em)
  A rectangle has area $x^2 + 9x + 20$. \
  #h(1.5em) (a) Factorise the area to find the side lengths in terms of $x$. \
  #h(1.5em) Hint: two numbers that multiply to $20$ and add to $9$. \
  #worklines(n: 3)
  #v(0.35em)
  #h(1.5em) (b) If $x = 5$, find the numeric dimensions and check area $= 90$. \
  #worklines(n: 3)
], points: 3)

// ===== ANSWER KEY: final answers only =====
#block(
  width: 100%, inset: (x: 0.7em, y: 0.6em),
  stroke: (left: 2.5pt + rgb("#d4a373"), rest: 0.5pt + rgb("#e5e7eb")),
  radius: 6pt, fill: rgb("#faf9f6"),
)[
  #text(weight: "bold", size: 10pt)[ANSWER KEY: final answers + challenge worked solutions]
  #v(0.35em)
  #text(size: 9pt)[
    #grid(
      columns: (1fr, 1fr),
      gutter: 0.6em,
      [
        Q1-A: (a); B: $9p$; $5k$ \
        Q2-A: (a); B: $8y$; $2$; $8y + 2$ \
        Q3-A: (a); B: $7x + 2x^2$ \
        Q4-A: (b); B: $2a + 12$ \
        Q5-A: (a); B: $-3b + 12$ \
        Q6-A: (a); B: $2y^2 - 6y$ \
        Q7-A: (a); B: $8x$; $12$; $x^2 + 8x + 12$ \
        Q8-A: (a); B: $2x$; $-15$; $x^2 + 2x - 15$ \
        Q9-A: (a); B: $7x$; $-4$ \
        Q10-A: (a); B: $8x$; $16$ \
        Q11-A: (a); B: (a); C: $-8y$; $+16$ \
        Q12-A: (a); B: $6a$; $2$ \
      ],
      [
        Q13-A: (b); B: $5y$; $9$ \
        Q14-A: (a); B: $4x$; $-4$ \
        Q15-A: (a); B: $4$ \
        Q16-A: (a); B: $5$; $2a + 3$ \
        Q17-A: (a); B: $3$; $(x + 5)(x + 3)$ \
        Q18-A: (a); B: $12$; $7$ \
        Q19-A: (a); B: $-15$; $2$ \
        Q20-A: (a); B: $-$, $+$; $(y - 4)(y + 4)$ \
        Q21-A: (a); B: $8x$; $4$ \
        Q22-A: (a); B: $-$, $+$; $(2y - 5)(2y + 5)$ \
        Q23-A: (a); B: $2x^2 + 3x + 1$ \
        Q24-A: (a); B: $6$ \
        Q25-A: (a); B: $3y + 2$ \
        Q26-A: (a); B: $2x + 3$ \
        Q27-A: (a); B: $(x + 4)(x + 3)$ \
        Q28-A: (a); B: $5x$; $6$ \
        Q29-A: (a); B: $6$; $(y - 6)(y + 6)$ \
        Q30-A: (a); B: (a); C: $-$, $+$ \
        Q31-A: (a); B: (a); C: $-$, $4$ \
      ],
    )
  ]
  #v(0.5em)
  #text(weight: "bold", size: 10pt, fill: rgb("#9d0208"))[CHALLENGE solutions (worked short)]
  #v(0.35em)
  #text(size: 9pt)[
    *C1 (a)* $2x^2 - 18 = 2(x^2 - 9) = 2(x - 3)(x + 3)$. Factor 2 first, then squares. \
    *C1 (b)* $3x^3 - 27x = 3x(x^2 - 9) = 3x(x - 3)(x + 3)$. Factor $3x$ first, then squares. \
    #v(0.35em)
    *C2* $6x^2 + 11x + 3 = (3x + 1)(2x + 3)$ since Outer + Inner $= 9x + 2x = 11x$, Last $= 3$. Check: $(3x+1)(2x+3) = 6x^2 + 9x + 2x + 3$. \
    #v(0.35em)
    *C3 (a)* $x^3 - 27 = (x - 3)(x^2 + 3x + 9)$ ($a = x, b = 3$). \
    *C3 (b)* $64m^3 + 1 = (4m + 1)(16m^2 - 4m + 1)$ ($a = 4m, b = 1$). \
    #v(0.35em)
    *C4 (a)* $3x^2 + 6x + 2x + 4 = 3x(x + 2) + 2(x + 2) = (x + 2)(3x + 2)$. \
    *C4 (b)* $x^4 - 16 = (x^2 - 4)(x^2 + 4) = (x - 2)(x + 2)(x^2 + 4)$. Squares twice. \
    #v(0.35em)
    *C5* $x^2 + 9x + 20 = (x + 4)(x + 5)$ (since $4 times 5 = 20$, $4 + 5 = 9$), so sides are $(x + 4)$ and $(x + 5)$. If $x = 5$: $9$ by $10$; area $9 times 10 = 90$. \
  ]
]
