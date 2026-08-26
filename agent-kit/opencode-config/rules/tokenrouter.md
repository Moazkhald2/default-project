# TokenRouter Rule — Unified Gateway for qwen3.8-max-free

## Gateway
- Base URL: `https://api.tokenrouter.com/v1` (tokenrouter.com, NOT tokenrouter.me)
- Env: `TOKENROUTER_API_KEY` -> set in shell: `setx TOKENROUTER_API_KEY "sk-..."`
- Free model: `qwen/qwen3.8-max-free` ($0 in / $0 out, Free Test tier)
- Paid fallback: `qwen/qwen3.8-max` ($1 / $3 per 1M, 50% off this week)

## Usage (OpenAI SDK)
```python
from openai import OpenAI
client = OpenAI(base_url='https://api.tokenrouter.com/v1', api_key='<YOUR_API_KEY>')
stream = client.chat.completions.create(
    model="qwen/qwen3.8-max-free",
    messages=[{"role":"system","content":"You are concise."},{"role":"user","content":"Hello"}],
    stream=True, stream_options={"include_usage": True}
)
for chunk in stream:
    if chunk.choices and chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="")
```

## When to Use
- Free-tier prototyping, high-volume batch jobs, fallback when opencode/* models throttled
- NOT for sensitive data (use zero-retention note: verify policy)

## OpenCode Integration
- Add to any JS/TS: `new OpenAI({baseURL: "https://api.tokenrouter.com/v1", apiKey: process.env.TOKENROUTER_API_KEY})`
- Supports OpenCode, Codex CLI, Cherry Studio, OpenClaw via base_url override
- Dashboard: https://www.tokenrouter.com/models/

## Safety
- Never commit api_key; use .env gitignored
- Scamadviser: very likely legit (1yr+ domain, SSL, 99.9% uptime) — still rotate keys quarterly
