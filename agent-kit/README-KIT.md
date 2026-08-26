# Agent Kit — Clone This System on Another Device

One script rebuilds everything: project deps + the OpenCode agent brain (rules, skills, agents, MCP servers). Windows + PowerShell.

## Quick Start (on the new device)

> Running from a flash drive? The script must live INSIDE the project folder.
> Copy `agent-kit\` + `HANDOFF.md` from the drive into the synced project folder
> (`%USERPROFILE%\OneDrive\Documents\Default Project\`) first — never run it straight off the drive.

```powershell
# wait for OneDrive to finish syncing this folder first
cd "$env:USERPROFILE\OneDrive\Documents\Default Project"
powershell -ExecutionPolicy Bypass -File agent-kit\bootstrap.ps1
```

Preview without changing anything:

```powershell
powershell -ExecutionPolicy Bypass -File agent-kit\bootstrap.ps1 -DryRun
```

Overwrite an existing agent config with the bundled snapshot:

```powershell
powershell -ExecutionPolicy Bypass -File agent-kit\bootstrap.ps1 -ForceConfig
```

## What It Does

| Step | Action | Fatal if fails? |
|---|---|---|
| 1 | Prereq check: git, node>=24, npm>=11, python, typst — prints exact `winget install ...` fix for anything missing | git/node/npm yes; python/typst warn |
| 2 | Project: `npm install`, git hooks via `scripts/setup-hooks.mjs`, `.env` created from `.env.example` | yes |
| 3 | Agent brain: copies `opencode-config/` → `%USERPROFILE%\.config\opencode\`, remaps any `C:\Users\moaz7` paths to the new username, `npm install` for MCP deps | config missing = fail |
| 4 | Memory: clones + builds [obsidian-memory-layer-mcp](https://github.com/Moazkhald2/obsidian-memory-layer-mcp) into `~/obsidian-memory-layer-mcp`; checks vault at `~/ObsidianVault` and points to restore zip if absent | no |
| 5 | Gate: runs `npm run verify` (typecheck → lint → test → build) | yes |
| 6 | Prints manual checklist — API keys are **never** scripted | n/a |

Exit code `0` = ready (warnings possible), `1` = fatal list printed at bottom.

## Contents

```
agent-kit/
├── bootstrap.ps1          the script
├── README-KIT.md          this file
└── opencode-config/       snapshot of ~/.config/opencode (129 files)
    ├── opencode.jsonc     main config incl. all MCP server definitions
    ├── rules/             9 behavior rule files + token-optimization.md
    ├── agents/            9 custom subagents (planner, reviewer, math-tutor...)
    ├── commands/          /fix /plan /review /tdd slash commands
    ├── skills/            ~80 skills (math-* suite, taste variants, tdd...)
    └── package.json       MCP server npm deps (better-sqlite3 etc.)
```

Snapshot is stale after you change your real `~/.config/opencode`. Refresh it from THIS machine anytime:

```powershell
robocopy "$env:USERPROFILE\.config\opencode" "agent-kit\opencode-config" /MIR /XD node_modules /XF lsp-install-decisions.json
```

(Review `opencode.jsonc` diff before committing — it must stay secret-free.)

## Manual Steps After Bootstrap

1. Fill `.env` — `NVIDIA_NIM_API_KEY=nvapi-...` minimum (free models).
2. GitHub MCP token: `setx GITHUB_PERSONAL_ACCESS_TOKEN "ghp_..."`.
3. Optional free-model proxy (`fcc-opencode`): one-liner in root `README.md` → "Free Claude Code".
4. Launch `opencode` once — declared packages (superpowers, oh-my-openagent...) auto-install to `~/.cache/opencode/packages`.
5. First message to it: **"Read HANDOFF.md first."**

## Troubleshooting

| Symptom | Fix |
|---|---|
| `winget` hints printed | Run them; re-run bootstrap (it skips what's done) |
| robocopy exit >7 in step 3 | Path/permission issue — check `$CfgDest` manually |
| Verify red on fresh device but green here | Usually missing Typst or Node version <24 |
| Memories empty in opencode | Vault not restored — see step 4 output line for the exact `expand` command |
| MCP server errors about paths | Re-run with `-ForceConfig` so path remapping executes again |
