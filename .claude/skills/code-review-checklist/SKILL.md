---
name: code-review-checklist
description: Run a structured code review checklist against the current diff and report findings
---

Run a structured code review checklist against the current diff and report findings.

## Instructions

1. Run `git diff main` to get all changes on the current branch.
2. Review the diff against each checklist category below.
3. For each item, mark it as PASS, FAIL, or N/A and add a brief note if it fails.

## Checklist

### Correctness
- [ ] Logic is correct and handles edge cases
- [ ] No off-by-one errors or null/undefined access
- [ ] Async operations are properly awaited
- [ ] Error paths are handled

### Security
- [ ] No secrets, tokens, or credentials in code
- [ ] User input is validated at system boundaries
- [ ] No SQL injection, XSS, or command injection risks
- [ ] CORS and auth headers are not weakened

### Code Quality
- [ ] No dead code or commented-out blocks left in
- [ ] No magic numbers — constants are named
- [ ] Functions do one thing and are reasonably sized
- [ ] No unnecessary duplication

### Angular / TypeScript (if applicable)
- [ ] Components use standalone pattern — no NgModules
- [ ] Control flow uses `@if` / `@for`, not `*ngIf` / `*ngFor`
- [ ] HTTP calls go through the service layer, not directly in components
- [ ] `Product` interface matches `products.json` shape

### PHP API (if applicable)
- [ ] CORS headers are set correctly
- [ ] JSON output is valid and matches expected shape
- [ ] No framework dependencies introduced

### Tests & Coverage
- [ ] New behaviour has test coverage or absence is justified
- [ ] Tests are not mocking things they shouldn't

### Readability
- [ ] Variable and function names are self-explanatory
- [ ] Comments explain WHY, not WHAT
- [ ] No multi-paragraph comment blocks

## Output Format

For each failed item, output:
- **File**: `path/to/file.ts:line`
- **Issue**: what the problem is
- **Suggestion**: what to do instead

End with a summary: total checks, how many passed, how many failed, how many N/A.
