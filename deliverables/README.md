# Deliverables Index — ScentStore

Quick-reference inventory of all custom Claude Code deliverables built during this training sprint. Each entry links to the source file and describes what it does in one line.

---

## Custom Skills

| Skill | File | What it does |
|-------|------|--------------|
| `code-review-checklist` | `.claude/skills/code-review-checklist/SKILL.md` | Runs a structured checklist (correctness, security, quality, Angular/PHP conventions) against the current git diff and reports PASS/FAIL per item |
| `commit-message` | `.claude/skills/commit-message/SKILL.md` | Inspects staged changes and generates a Conventional Commits message (`feat/fix/refactor/…`) with imperative-mood summary and optional why-body |
| `pr-description` | `.claude/skills/pr-description/SKILL.md` | Generates a pull request description including summary, change list, AI-assistance disclosure, test coverage, and security considerations |
| `implement-story` | `.claude/skills/implement-story/SKILL.md` | Orchestrates full story delivery across 5 phases: preparation, planning (architect agent), implementation, quality gates (code-reviewer + qa-specialist agents), and completion |
| `handle-pr-feedback` | `.claude/skills/handle-pr-feedback/SKILL.md` | Fetches PR comments from Azure DevOps, implements each actionable fix, commits, pushes, and posts a summary comment back to the PR |

---

## Custom Agents

| Agent | File | What it does |
|-------|------|--------------|
| `qa-specialist` | `.claude/agents/qa-specialist.md` | QA engineer persona that validates Angular/PHP integration: API contract, data flow, UI behaviour, responsive layout, and regression checks — always returns a PASS / FAIL / NEEDS MANUAL TESTING verdict |
| `ux-reviewer` | `.claude/agents/ux-reviewer.md` | UX specialist that navigates the live app via Chrome DevTools, takes screenshots, and flags real usability issues: contrast, touch targets, empty states, inconsistent layout |

---

## Hooks

| Hook | Trigger | File | What it does |
|------|---------|------|--------------|
| `b[README.md](README.md)lock-destructive-git` | `PreToolUse` on `Bash` | `.claude/hooks/block-destructive-git.sh` | Intercepts Bash tool calls and denies any command containing `git push --force`, `git reset --hard`, or `git clean -fd`, requiring manual execution instead |
| `eslint-on-save` | `PostToolUse` on `Edit` / `Write` | `.claude/settings.json` | Runs `eslint --fix` automatically on any TypeScript file after Claude edits or writes it |

---

## Automated Workflow

| Workflow | File | What it does |
|----------|------|--------------|
| `implement-story` | `.claude/skills/implement-story/SKILL.md` | Multi-step orchestration: reads the story, resolves dependency conflicts, consults the architect agent for the plan, waits for human approval, implements with tests, runs code-reviewer and qa-specialist agents on the output, then commits and pushes — stopping and reporting if any phase fails |

---

## Supporting Documents

| Document | File | What it does |
|----------|------|--------------|
| Project context | `CLAUDE.md` | Tells Claude the tech stack, conventions, data model, and what is out of scope for this project |
| Setup & features | `README.md` | Human-readable setup guide: prerequisites, start commands, project structure, feature list |
| Reflection | `REFLECTION.md` | Learning journal covering project motivation, the Lab 8A agent-chaining exercise, ADR generation, and story verification |
| ADRs | `docs/adr/` | Architecture Decision Records: ADR-001 technology stack, ADR-003 API structure, ADR-004 background job processing strategy |
