# Token Optimization Instructions

## Output Rules (MANDATORY)

1. **Code only, no explanation** — unless user explicitly asks for explanation
2. **Bullets over paragraphs** — keep answers terse
3. **No preamble** — skip "Great question!", "I'll help you with...", "Let me start by..."
4. **Single-word answers acceptable** when appropriate

## Model Routing (FREE-FIRST)

IMPORTANT: You are on a FREE budget. Default to free models.
Only escalate to paid models when the free model fails or the task is
genuinely too complex for a free model.

### Routing Table

| Task Type | Category | Primary Model (FREE) | Paid Escalation |
|-----------|----------|---------------------|-----------------|
| Simple edits, typo fixes, config | `quick` | `north-mini-code-free` | `deepseek-v4-flash-free` → `mimo-v2.5-free` |
| Explore/search codebase | `explore` | `deepseek-v4-flash-free` | `north-mini-code-free` → `mimo-v2.5-free` |
| Documentation, writing | `writing` | `deepseek-v4-flash-free` | `north-mini-code-free` → `mimo-v2.5-free` |
| Low-effort tasks | `unspecified-low` | `deepseek-v4-flash-free` | `north-mini-code-free` → `big-pickle` |
| Medium-effort tasks | `unspecified-high` | `deepseek-v4-flash-free` | `big-pickle` → `nemotron-3-ultra-free` |
| Hard logic, architecture | `ultrabrain` | `big-pickle` (high) | `gpt-5.5` (xhigh) → `claude-opus-4-7` |
| Visual/design work | `visual-engineering` | `qwen3.6-plus` | `gemini-3.1-pro` → `nemotron-3-ultra-free` |
| Deep implementation | `deep` | `big-pickle` | `gpt-5.5` → `claude-opus-4-7` |
| Creative/artistic work | `artistry` | `gemini-3.1-pro` | `big-pickle` → `gpt-5.5` |

### Agent Model Routing

| Agent | Primary | Fallback Chain |
|-------|---------|----------------|
| Sisyphus (main) | `deepseek-v4-flash-free` | `big-pickle` → `north-mini-code-free` → `claude-opus-4-7` |
| Deep-debug | `big-pickle` | `gpt-5.5` → `claude-opus-4-7` |
| Explore (grep) | `deepseek-v4-flash-free` | `north-mini-code-free` → `mimo-v2.5-free` |
| Multimodal | `qwen3.6-plus` | `gemini-3.1-pro` → `nemotron-3-ultra-free` |
| Strategy-plan | `big-pickle` (high) | `gpt-5.5` → `claude-opus-4-7` |

### When to Escalate (ONLY if ALL true):
1. Free model fails or produces wrong output
2. Task requires complex reasoning (architecture, security review)
3. User explicitly asks for a specific paid model

## Subagent Delegation Rules

1. **Default to single-agent** — handle directly unless:
   - Task has truly independent parallelizable side work
   - Context isolation saves 8+ file reads from main context
   - Coordination cost is clearly repaid by parallelism

2. **Lean handoffs** — when delegating:
   - One focused goal per subagent
   - Compact structured output only
   - No recursive fan-out (one level deep max)

3. **Never delegate:**
   - Single-file edits
   - Trivial fixes
   - Tasks needing current conversation context

## Context Hygiene

1. **Prune instructions** — only "landmines" (critical rules), no filler
2. **Audit MCP tools** — disable unused servers/tools (each costs 100-500 tokens/step)
3. **Scope context** — mention specific files when you know them
4. **Compact long sessions** — start fresh when switching tasks
5. **Auto-compact session at 20+ turns** — prevents context bloat

## Cost Awareness

- Output tokens cost 5x more than input tokens
- Cached tokens cost 0.1x of fresh input
- Keep model/MCP set stable within sessions
- Use cheapest model capable for the task
- **Subagent continuation** (`task(task_id=ses_...)`) saves 70%+ vs starting fresh
- Prefer cache hits: reuse subagent sessions instead of new ones
