---
name: commit-message
description: Generate a conventional commit message for the current staged changes
---

Generate a conventional commit message for the current staged changes.

## Instructions

1. Run `git diff --cached` to see what is staged. If nothing is staged, run `git diff` instead and note that to the user.
2. Identify the type of change:
   - `feat` — new feature
   - `fix` — bug fix
   - `refactor` — code change that neither fixes a bug nor adds a feature
   - `style` — formatting, whitespace, no logic change
   - `test` — adding or updating tests
   - `docs` — documentation only
   - `chore` — build process, dependencies, config

3. Output a single commit message in this format:

```
<type>(<scope>): <short summary under 72 chars>

<optional body — explain WHY, not WHAT, if the change needs context>
```

## Rules
- Summary line must be imperative mood: "add feature" not "added feature"
- Scope is the affected area (e.g. `carousel`, `product-service`, `api`, `styles`)
- Body is only needed if the why is non-obvious
- Do not invent context — only use what the diff shows
- Output the message in a code block so it can be copied easily
