# MCP Server Usage Guide

## Available Servers & When to Use

| Server | Use For | Example |
|--------|---------|---------|
| obsidian-memory | Persistent memory, project context, session management | "Save this decision", "Recall what we discussed" |
| sequential-thinking | Complex reasoning, multi-step analysis | Debugging a hard bug, planning architecture |
| brave_search | Web research, finding docs, latest info | "Search for React 19 API changes" |
| filesystem | File operations outside project | Read config files, check logs |
| github | PRs, issues, repo management | "Create a PR", "List open issues" |
| playwright | Browser testing, web scraping | "Test this page renders correctly" |

## Guidelines
- Use the right tool for the job — don't use filesystem when grep works
- Sequential-thinking is expensive — use it for hard problems only
- Prefer obsidian-memory over saving to random files
