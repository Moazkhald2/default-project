# Prompt Skills — Ruben 9 + Grill-Me

> Source: `x.com/rubenhassid/status/2092930121527386182` + Charlie Hills anti-slop `x.com/charliejhills/status/2092898653820400076`

Stack in one chat: `/prompt-master` -> `/grill-me` -> `/how-to` -> `/anti-ai` -> `/handoff`.

## Installed short versions (use directly)

**/prompt-master** — restructure brain dump before run:
```
Rewrite this as clean task spec: goal, constraints, inputs, outputs, success criteria. No prose.
```

**/grill-me** — interrogate until nothing vague (maps to `superpowers/brainstorming`):
```
Interrogate this spec until zero vague nouns. Ask one question at a time. Fix spec in answers.
```

**/anti-ai** — strip giveaways before emit:
```
Remove em-dashes, "delve", "tapestry", purple glows. Use ui-ux-pro-max tokens only.
```

**/handoff** — compress chat to next prompt (maps to `memories/consensus.md`):
```
Summarize: done, decisions, Next Action (1 line), files changed. Ready for next agent.
```

Full 9 in zip at `claude-skills.free` — we keep 3 lightweight to avoid context bloat. All 9 available via `npx skills ls` when needed.
