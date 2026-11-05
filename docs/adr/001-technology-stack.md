# ADR-001: Technology Stack Choices

**Status:** Accepted
**Date:** 2026-05-28

## Context

ScentStore is a 2–4 week training sprint designed to teach end-to-end integration between a modern frontend framework and a lightweight backend. The chosen stack needs to:

- Be realistic enough to reflect industry patterns
- Be approachable for a trainee developer within the sprint timeline
- Avoid introducing infrastructure complexity that distracts from the learning objectives (API integration, component design, state management)

The PRD explicitly mandates Angular for the frontend and PHP for the backend, leaving component library, PHP approach, and tooling as open decisions.

## Options Considered

### Frontend component library
| Option | Reason rejected / accepted |
|--------|---------------------------|
| Angular Material | Fewer data-display components (no carousel out of the box) |
| **PrimeNG 17** | Rich set of pre-built components (carousel, card, dropdown) that directly map to PRD features; good Angular 18 compatibility |
| NgBootstrap | Less component variety; more CSS-oriented than component-oriented |

### Backend approach
| Option | Reason rejected / accepted |
|--------|---------------------------|
| Laravel | Full framework adds configuration overhead that exceeds the sprint scope |
| Symfony | Same concern as Laravel |
| **Plain PHP 8** | Zero framework setup; trainees can focus on the HTTP/JSON layer without framework abstractions |

### Data source
| Option | Reason rejected / accepted |
|--------|---------------------------|
| MySQL with ORM | Adds database setup and migration complexity; out of scope per PRD |
| **Static JSON file** | Immediately runnable, no infrastructure dependency, easy to inspect and edit |
| SQLite | Better than MySQL for simplicity, but still adds a query layer beyond what the sprint needs |

## Decision

- **Frontend:** Angular 18 (standalone components, no NgModules) with PrimeNG 17 and SCSS
- **Backend:** Plain PHP 8 with no framework
- **Data source:** Static JSON file (`backend/data/products.json`) served by PHP
- **Build tooling:** Angular CLI 18

Angular 18 standalone components are used throughout to reflect current Angular best practices and avoid teaching the older NgModule pattern that trainees would need to unlearn.

## Consequences

### Positive
- Trainees encounter current Angular patterns (standalone, `@if`/`@for` control flow, `provideHttpClient`)
- PrimeNG covers all PRD UI requirements (carousel, card, dropdown) without custom component work
- Plain PHP is transparent — every line of the backend is visible and understandable without framework knowledge
- Static JSON means the project runs with only `php -S` and `ng serve`; no database setup required

### Negative / Trade-offs
- PrimeNG 17 theming uses the legacy CSS stylesheet approach; PrimeNG 18+ moved to a token-based system, so this knowledge partially ages out
- Plain PHP has no request routing, middleware, or validation framework — patterns would need to change significantly before production use
- Static JSON data cannot be updated at runtime; switching to MySQL requires replacing `file_get_contents` with PDO queries (scaffolded but inactive in `backend/config/database.php`)
- No server-side rendering (SSR) — initial load performance relies entirely on the client bundle
