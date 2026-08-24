---
name: free-claude-code
description: Use OpenCode, Claude Code, Codex, Pi with free models via Alishahryar1/free-claude-code proxy (49 providers, 1.3B+ free tokens)
---

# free-claude-code

Proxy `Alishahryar1/free-claude-code` (`47.5k` stars, MIT) routes `OpenCode`/`Claude Code`/`Codex`/`Pi` API calls to free or local providers. No Anthropic key required. ToS-friendly, supports 49 providers, 9 agents, auto-failover.

## When to use

- Need free inference for `OpenCode` during dev (NVIDIA NIM 40 req/min, OpenRouter, Groq, etc.)
- Want local models (`LM Studio`, `Ollama`, `llama.cpp`) via same `OpenCode` interface
- Provider outage — FCC retries then falls back to next model
- Save tokens — optional RTK + 5 built-in optimizations (prefix detection, probe mocks)

## Quick Start

### 1. Install Or Update

Windows PowerShell (this repo runs `win32`):

```powershell
& ([scriptblock]::Create((irm "https://raw.githubusercontent.com/Alishahryar1/free-claude-code/main/scripts/install.ps1")))
```

macOS/Linux:

```bash
curl -fsSL "https://raw.githubusercontent.com/Alishahryar1/free-claude-code/main/scripts/install.sh" | sh
```

Review before running: `scripts/install.ps1` and `scripts/install.sh` in `Alishahryar1/free-claude-code`.

Re-run same command to update. Installer prompts for at least one agent (`OpenCode`) and optional RTK.

### 2. Start FCC

Windows: Open **Free Claude Code** from Start menu / desktop (tray icon).
macOS: Open **Free Claude Code** from Applications.
Linux: `fcc-server` (keep terminal open).

Admin UI opens automatically. Note `http://localhost:8082` and proxy token (`freecc` default).

### 3. Configure Provider (Admin UI)

1. Create key — recommended free: `https://build.nvidia.com/settings/api-keys` (NVIDIA NIM)
2. Paste into `NVIDIA_NIM_API_KEY` in Admin UI
3. Select `MODEL` — e.g. `nvidia_nim/nvidia/nemotron-3-super-120b-a12b` or search dropdown
4. Click **Validate** → **Apply**

Other providers (`opencode.json:3` catalog):

| Provider          | Setting              | Example MODEL                                       |
| ----------------- | -------------------- | --------------------------------------------------- |
| NVIDIA NIM        | `NVIDIA_NIM_API_KEY` | `nvidia_nim/nvidia/nemotron-3-super-120b-a12b`      |
| OpenRouter        | `OPENROUTER_API_KEY` | `open_router/openrouter/free`                       |
| Groq              | `GROQ_API_KEY`       | `groq/llama-3.3-70b-versatile`                      |
| DeepSeek          | `DEEPSEEK_API_KEY`   | `deepseek/deepseek-chat`                            |
| LM Studio (local) | `LM_STUDIO_BASE_URL` | `lmstudio/<model-id>` at `http://localhost:1234/v1` |
| Ollama (local)    | `OLLAMA_BASE_URL`    | `ollama/<tag>` at `http://localhost:11434`          |
| llama.cpp         | `LLAMACPP_BASE_URL`  | `llamacpp/<model-id>` at `http://localhost:8080/v1` |

Add ordered **Fallback Models** under **Model Config** for outage resilience.

### 4. Run OpenCode via FCC

```bash
fcc-opencode          # uses Admin UI model
fcc-opencode --help   # normal OpenCode args pass through
```

VS Code / Cursor: FCC launchers leave sessions/extensions untouched; `fcc-opencode` wraps `opencode` binary with `ANTHROPIC_BASE_URL=http://localhost:8082` + auth token.

Model picker: Inside OpenCode, use native `/model` to switch FCC models live.

Other launchers (if installed): `fcc-claude`, `fcc-codex`, `fcc-pi`, `fcc-cline` — all share same Admin UI config.

## Local Providers

**LM Studio:** start local server, load tool-capable model, set `MODEL=lmstudio/<id>`. Default `http://localhost:1234/v1`.

**Ollama:**

```bash
ollama pull llama3.1
ollama serve
# MODEL=ollama/llama3.1
```

**llama.cpp:** start `llama-server` with `--port 8080`, set `MODEL=llamacpp/my-model`.

## Optional Integrations

Admin UI → **Messaging** → Validate → Apply.

- **Discord:** create bot at `discord.com/developers/applications`, enable Message Content Intent, invite with Read/Send/Manage Messages, set `Discord Bot Token` + `Allowed Directory` (absolute path, e.g. `C:/Users/you/projects`).
- **Telegram:** `MESSAGING_PLATFORM=telegram`, set `TELEGRAM_BOT_TOKEN` from `@BotFather` + `ALLOWED_TELEGRAM_USER_ID`.
- **Voice:** re-run installer with `-VoiceNim` (NVIDIA NIM) or `-VoiceLocal` (Whisper CPU/CUDA), enable in Admin → Voice, choose `cpu`/`cuda`/`nvidia_nim`.

## Security Notes

- FCC runs locally on `http://localhost:8082` — no data leaves machine except to chosen provider
- Enable **Proxy Authentication** in Admin UI to set bearer token (`freecc` default)
- Verify installer scripts before `irm | iex` / `curl | sh`
- `.env` is gitignored (`# .gitignore` covers `.env`); keys never committed — see `scripts/verify.mjs:3` pass
- ToS-friendly — FCC removes providers that disallow proxying

## Troubleshooting

- **Login prompt loop:** set `~/.claude.json` → `"hasCompletedOnboarding": true` then restart agent
- **Port mismatch:** match `ANTHROPIC_BASE_URL` port to Admin UI (default `8082`)
- **Model not listed:** enter `<provider-id>/<exact-model-id>` manually if provider cannot list models
- **Update:** re-run install command; check version `fcc-server --version`
- **Uninstall:** `& ([scriptblock]::Create((irm "https://raw.githubusercontent.com/Alishahryar1/free-claude-code/main/scripts/uninstall.ps1")))` — removes `~/.fcc/` but keeps `opencode` + `uv`/`Python`

## References

- Repo: `https://github.com/Alishahryar1/free-claude-code` — README, `ARCHITECTURE.md`, `CONTRIBUTING.md`
- Admin UI, model catalog, fallback config — `http://localhost:8082` after `fcc-server` start
- License: MIT

## Checklist

- [ ] `fcc-server` starts, Admin UI reachable at `http://localhost:8082`
- [ ] Provider key pasted, `MODEL` validated (green check), **Apply** clicked
- [ ] `fcc-opencode` launches OpenCode with FCC model in picker
- [ ] Fallback models configured (optional) for outage resilience
- [ ] `npm run verify` still exits 0 — FCC is external tool, no repo changes break `scripts/verify.mjs:3`
