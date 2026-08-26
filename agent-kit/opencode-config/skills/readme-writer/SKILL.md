# README Writer Skill

## Structure

Every README should answer five questions in order:

1. **What is this?** — One-paragraph description of the project
2. **Why does this exist?** — The problem it solves, how it's different
3. **How do I get started?** — Quick install and minimal usage example
4. **How do I use it?** — API docs, configuration, examples
5. **How do I contribute?** — Contributing guidelines, license

## Template

```markdown
# Project Name

> One-line tagline describing what this project does.

[![CI](https://img.shields.io/github/actions/workflow/status/org/repo/ci.yml)](https://github.com/org/repo/actions)
[![npm](https://img.shields.io/npm/v/package-name)](https://www.npmjs.com/package/package-name)
[![License](https://img.shields.io/github/license/org/repo)](LICENSE)

## Overview

Two to three paragraphs explaining:
- What problem this solves
- Who it's for (target audience)
- What makes it different from alternatives

## Installation

\`\`\`bash
# npm
npm install package-name

# pip
pip install package-name

# go
go get github.com/org/repo

# Or clone and build from source
git clone https://github.com/org/repo.git
cd repo
make build
\`\`\`

## Quick Start

\`\`\`typescript
import { something } from 'package-name';

const result = something({ option: 'value' });
console.log(result);
\`\`\`

## API

### `something(options)`

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `options.option` | `string` | `'default'` | What this option does |
| `options.timeout` | `number` | `5000` | Timeout in ms |

Returns: `Promise<Result>`

Throws: `ValidationError` if options are invalid.

### Configuration

Explain how to configure the project — env vars, config files, CLI flags.

| Env Var | Default | Description |
|---------|---------|-------------|
| `SOME_KEY` | — | API key for external service |

## Examples

More detailed examples for common use cases. Use real, runnable code.

\`\`\`typescript
// Example with full context
\`\`\`

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

[MIT](LICENSE) — (or whatever license)
```

## Style Guide

- **Keep it concise** — users scan. Use short paragraphs, bullet points, code blocks
- **First person** — "We built X to solve Y" not "This project was built to..."
- **Badges at the top** — CI status, version, license, coverage
- **Screenshots/GIFs** — Show the UI if there is one. A GIF of the workflow is worth 1000 words
- **No emojis in headings** — they break screen readers and look unprofessional in terminals
- **TOC for long READMEs** — `<!-- toc -->` with `markdown-toc` or similar
- **Real examples** — Don't write placeholder examples. Use actual CLI output or API responses

## Installation Instructions by Platform

| Platform | Package Manager | Command |
|----------|----------------|---------|
| Node.js | npm / yarn / pnpm | `npm install pkg` |
| Python | pip / uv / poetry | `pip install pkg` |
| Go | go get | `go get pkg` |
| Rust | cargo | `cargo add pkg` |
| macOS | Homebrew | `brew install pkg` |
| Docker | docker | `docker pull org/pkg` |

## What to Include

- [ ] Badges: CI, version, license, coverage
- [ ] Installation instructions for all relevant platforms
- [ ] Quick start with minimal setup
- [ ] API documentation (if a library)
- [ ] Configuration reference (if an app/tool)
- [ ] Link to full documentation
- [ ] Contributing guide link
- [ ] License
- [ ] Changelog link

## What NOT to Include

- Installation instructions for trivial things (`Node.js and npm are required`)
- Long lists of contributors (git blame exists)
- Tutorials (link to a separate docs site)
- Known bugs (link to issue tracker instead)
- Outdated information (keep the README current or remove it)
