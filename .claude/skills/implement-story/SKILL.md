---
name: implement-story
description: Implement a story with full workflow including quality gates
---

Implement the specified story using the full 5-phase workflow.

## Phase 1: Preparation
1. Read the story from docs/stories/ (or Azure DevOps if connected)
2. Check for dependency conflicts with other in-progress work
3. If conflicts exist, STOP and report them

## Phase 2: Planning
1. Use the architect agent to propose the implementation approach
2. If architecture changes are needed, create or update ADRs in docs/adr/
3. Present the implementation plan
4. WAIT for user approval before proceeding

## Phase 3: Implementation
1. Implement the feature following the approved plan
2. Add appropriate error handling
3. Write unit tests for new code
4. Ensure all existing tests still pass

## Phase 4: Quality Gates
1. Use the code-reviewer agent on the changes
2. Address any Critical or Major issues
3. Use the qa-specialist agent to check edge cases
4. Fix any blocking issues found

## Phase 5: Completion
1. Create a commit with a descriptive message: "feat: [story summary]"
2. Push to the feature branch
3. Provide a summary of changes made

If any phase fails, STOP and report the issue before continuing.
