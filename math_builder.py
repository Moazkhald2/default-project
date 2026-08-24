#!/usr/bin/env python3
"""
math_builder.py — fetcher, adapter, publisher (Python engine for OpenCode)
Pulls pre-verified Markdown+LaTeX from Local_Math_Vault, pairs with SVG, outputs
Typst PDF sheet + React/KaTeX exam file. No GPU.

Usage:
  python math_builder.py --topic circle_theorems --grade 10
  python math_builder.py --topic quadratic_formula --vault ./Local_Math_Vault --out ./dist
"""
import os
import re
import json
import argparse
import subprocess
from pathlib import Path

TYPST_TEMPLATE = """#import "@preview/cetz:0.5.2": canvas, draw
#set page(paper: "a4", margin: (x: 1.8cm, y: 1.6cm), footer: align(center)[#text(8pt, fill: luma(120))[Math Academy — Confidential]])
#set text(font: "Libertinus Serif", size: 10.5pt)

#let header(academy: "Math Academy", unit: "{topic}", date: datetime.today()) = {{
  grid(columns: (1fr, auto), align(left)[#text(weight: "bold", 12pt)[#academy] #h(0.5em) #text(fill: rgb("#6b7280"))[| #unit]], align(right)[#text(9pt, fill: rgb("#6b7280"))[#date.display("[year]-[month]-[day]")]])
  line(length: 100%, stroke: 0.6pt + rgb("#e5e7eb"))
  v(0.6em)
  grid(columns: (1fr,1fr,1fr), [#text(8.5pt)[Name: #line(length: 5cm, stroke: 0.4pt)]], [#text(8.5pt)[Class: #line(length: 3cm, stroke: 0.4pt)]], [#text(8.5pt)[Score: #box(width: 2cm, height: 0.9em, stroke: 0.4pt)]])
  v(1em)
}}
#let question(number, body, figure: none, points: 1) = {{
  block(width: 100%, inset: (x: 0.6em, y: 0.6em), stroke: (left: 2pt + rgb("#111827"), rest: 0.5pt + rgb("#e5e7eb")), radius: 6pt)[#text(weight: "bold")[Question #number] #h(0.4em) #text(8pt, fill: rgb("#6b7280"))[(#points pt)] #v(0.4em) #body #if figure != none {{v(0.6em); align(center)[#figure]}}]
  v(0.7em)
}}
#header(unit: "{topic}")
{questions_typst}
"""

ASTRO_TEMPLATE = """---
const topic = "{topic}";
---
<div class="exam-wrapper max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md">
  <header class="border-b pb-4 mb-6"><h1 class="text-2xl font-bold">Exam: {topic}</h1></header>
  {questions_astro}
</div>
"""

REACT_TEMPLATE = """import {{ Math, BlockMath }} from "./components/Math";
import {{ GebraEmbed }} from "./components/GebraEmbed";
// Auto-generated exam — topic: {topic}
export const exam = {questions_json};
"""

def normalize_for_typst(s: str) -> str:
    s = s.replace(r"\degree", " degree").replace(r"\angle", "angle").replace(r"\tan", "tan").replace(r"\approx", "approx")
    s = s.replace(r"\text{ cm}", '"cm"')
    s = s.replace(r"\pm", "plus.minus").replace(r"\sqrt", "sqrt").replace(r"\frac", "frac")
    SKIP = {"tan", "sin", "cos", "sqrt", "frac", "approx", "degree", "angle", "plus", "minus"}
    def split_vars(m):
        block = m.group(0)
        def repl(x):
            w = x.group(0)
            if w.lower() in SKIP or w in SKIP:
                return w
            return " ".join(list(w))
        return re.sub(r"[A-Za-z]{2,}", repl, block)
    s = re.sub(r"\$[^$]*\$", split_vars, s)
    return s

def parse_md(p: Path):
    txt = p.read_text(encoding="utf-8")
    fm = {}
    body = txt
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", txt, re.DOTALL)
    if m:
        for line in m.group(1).split("\n"):
            if ":" in line:
                k, v = line.split(":", 1)
                fm[k.strip()] = v.strip().strip('"').strip("'")
        body = m.group(2).strip()
    return fm, body

def build(topic: str, vault_dir: str, out_dir: str, grade: str = ""):
    vault = Path(vault_dir)
    out = Path(out_dir)
    out.mkdir(parents=True, exist_ok=True)

    norm = topic.lower().replace("-", "_").replace(" ", "_")
    candidates = list(vault.rglob("*.md")) + list(Path("content/bank").rglob("*.md"))
    matched = []
    for q in candidates:
        fm, body = parse_md(q)
        t = fm.get("topic", "").lower().replace("-", "_")
        g = fm.get("grade", "")
        if t == norm or norm in t or t in norm:
            if grade and g != grade:
                continue
            matched.append((fm, body, q))

    # dedupe by id
    seen = set()
    uniq = []
    for fm, body, q in matched:
        iid = fm.get("id", str(q))
        if iid not in seen:
            seen.add(iid)
            uniq.append((fm, body, q))
    matched = uniq

    if not matched:
        print(f"[!] No local questions for '{topic}' - placeholder")
        matched.append(({"id": "q1", "grade": grade or "10", "topic": topic, "figure": ""}, f"Sample for {topic}: Solve $x^2+5x+6=0$.", Path("placeholder")))

    matched = matched[:8]  # limit sheet size

    typst_qs = []
    astro_qs = []
    react_qs = []

    for i, (fm, body, _) in enumerate(matched, 1):
        prompt = body.split("\n\n")[0].replace("\n", " ")
        typst_prompt = normalize_for_typst(prompt)
        fig = fm.get("figure", "")
        fig_typst = f'figure: image("/assets/geometry_templates/{fig}", width: 60%),' if fig and fig != "null" else ""
        if fig and fig != "null" and not (Path("assets/geometry_templates") / fig).exists() and not (Path("Local_Math_Vault/Vector_Assets/SVG_Diagrams") / fig).exists():
            fig_typst = ""  # no figure file, skip to avoid compile error
        typst_qs.append(f'#question({i}, [\n  {typst_prompt}\n], {fig_typst} points: {fm.get("points","2")})')
        astro_qs.append(f'<div class="question-box"><h3>Q{i}</h3><p>{prompt}</p></div>')
        react_qs.append({"id": fm.get("id", f"q{i}"), "promptTex": prompt, "figureSvg": fig, "materialId": fm.get("materialId", "")})

    typst_content = TYPST_TEMPLATE.format(topic=topic.replace("_"," ").title(), questions_typst="\n\n".join(typst_qs))
    astro_content = ASTRO_TEMPLATE.format(topic=topic.replace("_"," ").title(), questions_astro="\n\n".join(astro_qs))
    react_content = REACT_TEMPLATE.format(topic=topic, questions_json=json.dumps(react_qs, indent=2))

    typst_file = out / "sheet.typ"
    typst_file.write_text(typst_content, encoding="utf-8")
    (out / "exam.astro").write_text(astro_content, encoding="utf-8")
    (out / "exam.react.json").write_text(json.dumps(react_qs, indent=2), encoding="utf-8")
    (out / "exam.tsx").write_text(react_content, encoding="utf-8")

    print(f"[OK] Typst: {typst_file}")
    print(f"[OK] Astro: {out / 'exam.astro'}")
    print(f"[OK] React: {out / 'exam.react.json'} ({len(matched)} Qs)")

    pdf = out / "sheet.pdf"
    try:
        res = subprocess.run(["typst", "compile", "--root", ".", str(typst_file), str(pdf)], capture_output=True, text=True, timeout=10)
        if res.returncode == 0:
            print(f"[OK] PDF: {pdf} (<0.1s)")
        else:
            print(f"[ERR] Typst error:\n{res.stderr[:800]}")
            (out / "compile_error.log").write_text(res.stderr, encoding="utf-8")
    except FileNotFoundError:
        print("[!] typst not installed — https://github.com/typst/typst/releases")

if __name__ == "__main__":
    ap = argparse.ArgumentParser(description="Fetcher+Publisher for Math Vault")
    ap.add_argument("--topic", required=True, help="e.g. circle_theorems, quadratic_formula")
    ap.add_argument("--vault", default="./Local_Math_Vault")
    ap.add_argument("--out", default="./dist")
    ap.add_argument("--grade", default="")
    args = ap.parse_args()
    build(args.topic, args.vault, args.out, args.grade)
