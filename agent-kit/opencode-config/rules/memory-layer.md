# Memory Layer — Agent Rules

You have long-term memory via MCP tools (obsidian-memory). It persists across sessions.

## Mandatory lifecycle
- **session_start(project)** when a project is mentioned or work begins → read returned context (description, tech stack, progress, TODOs, recent sessions) → tell user what you remember and ask what to work on.
- **session_end(project, session_id, done, decisions, notes, next_steps)** before the user leaves/closes chat. Also call progress_update.

## Save as you work (not in bulk)
| Trigger | Action |
|---|---|
| Architecture/tech decision | memory_save type=decision |
| Bug fix, workaround, pattern | memory_save type=learning |
| Task for later | memory_save type=todo |
| Useful docs/references | memory_save type=reference |
| Learned project structure | context_update |
| Task finished / started | progress_update (Completed / In Progress) |

## Before debugging — ALWAYS memory_recall first
Search by error keywords, component names, or symptoms. If found: summarize the prior fix and verify it applies. If not: debug, then save the new learning.

## Memory types
- decision — "chose X over Y because Z"
- learning — "bug caused by X, fixed by Y"
- todo — tasks for future sessions
- reference — useful external info

## Tags
Lowercase, 1-3 words, `#` prefix, ≥2 per memory (domain + type). Categories: domain (#auth #api #database #ui #deploy), type (#bug #performance #security #refactor), priority (#critical #nice-to-have), stack (#react #node #typescript #python), status (#wip #blocked #review #done). Use existing tags; don't invent new ones.

## What NOT to save
- Code snippets, temporary debug state, info already in code/git history, duplicates (search first), trivial facts.

## Saving quality
- Save the WHY, not the WHAT. Save what you TRIED that FAILED (most valuable).
- Include alternatives considered and context. Title 5-15 words; content 1-3 paragraphs (bullets for TODOs).

## Auto-save triggers (auto_save)
- New requirements/constraints, non-obvious design decisions, bug root cause found after significant debugging, user changes direction.

## Multi-project
- session_end current project BEFORE switching; session_start the new one.

## Troubleshooting
- session_start empty → new project; call context_update.
- memory_recall empty → broader terms.
- memory_update fails → wrong ID/project; use exact ID from save response.
- profile_load empty → profile not created; first profile_update creates it.
- ENOENT error → vault path wrong; check it exists and is writable.