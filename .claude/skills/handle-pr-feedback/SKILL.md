---
name: handle-pr-feedback
description: Handle feedback on a pull request
---

Handle feedback on pull request (provide PR number or URL).

1. Fetch PR details and comments from Azure DevOps
2. Identify all actionable feedback items
3. For each feedback item:
   a. Analyse the request
   b. Implement the fix
   c. Add or update tests if needed
4. Commit changes with message: "fix: address PR feedback"
5. Push to the same branch
6. Comment on the PR summarising what was changed

If any feedback item is unclear, ask for clarification before implementing.
