# Project Reflection: ScentStore (Training E-Commerce)

**Project:** ScentStore - A Perfume E-Commerce Training Project
**Date Started:** May 28, 2026
**Tech Stack:** Angular (Frontend), PrimeNG (UI), PHP (Backend), MySQL/JSON (Data)

---

## Entry 1: Project Idea & Motivation

### The Idea
I am building "ScentStore," a lightweight e-commerce application designed specifically as a training project to master the integration between a modern frontend framework (**Angular**) and a traditional backend language (**PHP**). The core functionality is a product catalog for perfumes, featuring a PrimeNG carousel for "Special Offers" and a responsive grid for browsing, with data served via a custom PHP API.

### Why I Chose This
I selected this project for three specific reasons:

1.  **Bridging the Gap:** My previous experience has been either purely frontend or purely backend. I need to understand the full "handshake" of data: how Angular services consume JSON, how to handle CORS headers in PHP, and how to structure a simple API without a heavy framework like Laravel.
2.  **Visual Complexity vs. Logic Simplicity:** Perfumes are a visual product. This project allows me to focus on **UI/UX implementation** (using PrimeNG components like Carousels and Cards) without getting bogged down in the extreme complexity of payment gateways, user authentication, or inventory locking. It strikes a balance between "looks real" and "buildable in a few weeks."
3.  **Real-World Relevance:** Many legacy systems still run on PHP, while new interfaces are built with Angular. Understanding how to glue these together is a practical skill set for maintaining and modernizing existing e-commerce platforms.

### Initial Expectations & Hypotheses
*   **Hypothesis:** I expect the **CORS configuration** in PHP to be the first major hurdle. I anticipate spending time debugging why the browser blocks the Angular app from fetching data from the local PHP server.
*   **Hypothesis:** **PrimeNG** will speed up the UI development significantly compared to writing custom CSS grids, but I need to learn the specific module imports to avoid "not a known element" errors.
*   **Risk:** I might over-engineer the database schema. I must stick to the PRD's "Out of Scope" list (no users, no carts) to ensure I finish the core API integration.

### Goals for Week 1
1.  Set up the Angular workspace and install PrimeNG.
2.  Create a static JSON file with 10 perfume entries.
3.  Write a basic PHP script to serve this JSON with correct `Content-Type` and `Access-Control-Allow-Origin` headers.
4.  Display the first carousel on the Angular home page.

---

## Entry 2: Project Initialization & Angular Setup

**Date:** May 28, 2026 (Session 1)
**Focus:** Scaffolding Angular 18 frontend and establishing PrimeNG integration

### The Challenge
Setting up Angular 18 with PrimeNG 17 revealed a critical learning moment: the framework's theming system requires explicit CSS imports to work at all. Angular's built-in style system and PrimeNG's global stylesheet dependency are not obvious when scaffolding a new project.

Initial problem: the app compiled without errors but rendered in unstyled HTML. The carousels existed in the template but appeared as generic divs with no theme applied.

### The Solution
1. Identified that PrimeNG requires three CSS files in `angular.json` global styles array:
   - `primeng/resources/themes/lara-light-indigo/theme.css` — the chosen Indigo Light theme
   - `primeng/resources/primeng.min.css` — component structure styles
   - `primeicons/primeicons.css` — icon set for component buttons

2. After adding these, the PrimeNG theme applied immediately. Carousels rendered with proper spacing, cards showed borders, and dropdown controls appeared with styling intact.

### Key Discovery
**PrimeNG's module imports are component-level, not application-level.** Each standalone component imports only the PrimeNG modules it needs (e.g., `CarouselModule`, `CardModule`). This is a departure from monolithic module bundles and requires discipline: forgetting to import `CardModule` in a component results in "p-card is not a known element" — a cryptic error that initially feels like a build failure, not a missing import.

This taught the importance of reading Angular error messages carefully. "Not a known element" always means "either this component doesn't exist or it wasn't declared/imported in this scope."

## Entry 3: API Connection & Data Flow Wiring

**Date:** May 28, 2026 (Session 1, continued)
**Focus:** Connecting the Angular service layer to the PHP backend endpoint

### The Challenge
Two separate systems — Angular on `localhost:4200` and PHP on `localhost:8080` — needed to exchange data. The challenge wasn't just making an HTTP call; it was understanding where the responsibility boundaries lay:

1. **CORS:** The browser prevents cross-origin requests by default. `http://localhost:4200` cannot fetch from `http://localhost:8080` without explicit permission headers from the server.
2. **Data shape matching:** The PHP endpoint returns raw JSON. The Angular component needs to map that JSON to the TypeScript `Product` interface, or types become `any` and type safety is lost.
3. **Service layer abstraction:** The urge is to call `HttpClient` directly in a component. Centralizing all HTTP in `ProductService` is an architectural pattern that isn't immediately obvious.

### The Solution
1. **CORS headers in PHP** — Added to `backend/api/products.php`:
   ```php
   header('Access-Control-Allow-Origin: http://localhost:4200');
   header('Content-Type: application/json');
   header('Access-Control-Allow-Methods: GET, OPTIONS');
   ```
   The `OPTIONS` method handler was essential; the browser sends a preflight OPTIONS request before each POST/cross-origin GET, and PHP must respond with 200 (not 404).

2. **ProductService as the HTTP facade** — All components call `this.productService.getProducts()` rather than injecting `HttpClient` directly. This single point of control means:
   - Components never know the URL or parameter names
   - If the backend changes (`/api/products` → `/api/v2/products`), only one file updates
   - Error handling and retries can be added in one place

3. **Mapping JSON to TypeScript interface** — The `getProducts()` method explicitly types the return:
   ```typescript
   getProducts(): Observable<Product[]> {
     return this.http.get<Product[]>(...);
   }
   ```
   This tells TypeScript "I promise the server will return an array matching the `Product` interface." If the JSON shape changes, the type checker catches it.

### Key Discovery
**The service layer is not boilerplate — it's the contract between frontend and backend.** Changing data shapes, error handling, or API endpoints all flow through this one file. In a team environment, this is where the API contract is documented and tested. A trainee who learns to centralise HTTP calls in a service is learning a habit that scales to enterprise projects.

Another realization: Angular's environment files (`environment.ts` vs `environment.production.ts`) allow the API URL to differ per build. In development, the URL points to `localhost:8080`. In production, it can point to a cloud API without code changes — just a rebuild with `--configuration production`.

## Entry 4: Lab 8A — Agent Chaining (Special Offers Feature)

**Date:** 2026-06-09
**Feature:** Special Offers carousel — completing US-03 with discounted sale price display

---

### The Chain

Three agent perspectives were run in sequence on the same feature: Architect → Reviewer → (Developer addressed feedback after each).

---

### Phase 1: Architect

**What it surfaced:** The architect identified the core gap immediately — the carousel showed a crossed-out original price and a "% OFF" badge, but never showed the actual sale price the customer pays. It proposed:

- A component method `getDiscountedPrice(product)` (not an inline template expression, not a pipe) with explicit guards for edge cases: `undefined`, `0`, negative values, and values ≥ 100
- A three-element visual row: ~~$74.99~~ **$63.74** `15% OFF`
- New `.sale-price` SCSS rule using the existing brand purple (`#6b3fa0`) for consistency with the featured carousel
- `aria-label` bindings on each price span to distinguish "original price" from "sale price" for screen readers

**What the Architect missed:** It didn't question the `@if (product.discount)` truthy check against the method's own guard (which explicitly blocks `>= 100`). It also didn't notice the `.toFixed(2)` issue — numbers like `$63.7` would render without the trailing zero.

---

### Phase 2: Developer (Initial Implementation)

Implemented the architect's plan across three files. The implementation was faithful to the plan: added the component method, updated the HTML with the sale-price span inside the `@if` block, added `aria-label` bindings, and added `.sale-price` to the SCSS.

---

### Phase 3: Reviewer

**What it surfaced (7 findings):**

1. **Price formatting bug** — `getDiscountedPrice()` returns a raw `number`; `$63.7` renders instead of `$63.70`. Fix: `.toFixed(2)` in the template.
2. **aria-label bug** — same truncation issue inside the aria-label string literal.
3. **Strikethrough on no-discount products** — `.original-price` always applies `text-decoration: line-through` even when `discount` is absent. A crossed-out price with no cheaper alternative is misleading.
4. **Double call per cycle** — `getDiscountedPrice(product)` is called twice per change-detection cycle per product (once for display, once for the aria-label binding).
5. **`@if` / method guard mismatch** — the template `@if (product.discount)` is truthy, so `discount: 100` passes through and renders "100% OFF" next to a sale price equal to the original price.
6. **Alt text fallback** — if `product.name` is empty, `[alt]="product.name"` passes an empty string to screen readers.
7. **Subscription not unsubscribed** — `subscribe()` with no cleanup; safe for HTTP observables that complete, but brittle if the service ever switches to a live stream.

**What the Reviewer missed:** It didn't flag that finding #3 (the conditional class) requires a new `.plain-price` CSS rule — it suggested using a class toggle but didn't specify the missing style rule would also need to be written.

---

### Phase 4: Developer (Addresses Feedback)

**Addressed:**
- #1 & #2 — Added `.toFixed(2)` to all price display expressions and aria-label bindings (both carousels, original and sale price)
- #3 — Replaced `class="original-price"` with `[class]="... ? 'original-price' : 'plain-price'"` and added a `.plain-price` SCSS rule (purple, no strikethrough)
- #5 — Changed `@if (product.discount)` to `@if (product.discount && product.discount > 0 && product.discount < 100)` in both the conditional block and the class binding, aligning the template with `getDiscountedPrice`'s guard
- #6 — Changed `[alt]="product.name"` to `[alt]="product.name || 'Product image'"` in both carousels
- #7 — Injected `DestroyRef` into the constructor and added `.pipe(takeUntilDestroyed(this.destroyRef))` before `subscribe`

**Not addressed:**
- #4 (double call per cycle) — for a static dataset with four special-offer products this is negligible. The fix (pre-computing `discountedPrice` in `ngOnInit`) would add complexity without a measurable benefit at this scale. Noted here as the Angular pattern to apply if the dataset grows or if the service moves to a live stream.

---

### What Each Perspective Surfaced That the Previous One Missed

| Perspective | Unique catch |
|---|---|
| Architect | The missing sale price (the core feature gap — nothing before it had flagged this) |
| Reviewer | Formatting edge cases (`toFixed`), template/guard mismatch, lifecycle cleanup, conditional strikethrough — details the architect's design-level thinking skipped |
| Developer (Phase 4) | The missing `.plain-price` CSS rule that the Reviewer's own fix suggestion implied but didn't state |

### Key Takeaway

The Architect worked at the right level of abstraction — it correctly identified the guard conditions and layout ordering — but its output was design, not code, so formatting edge cases and Angular lifecycle patterns weren't visible yet. The Reviewer caught exactly what a code-level read reveals: things that look fine in prose but break in the rendered output (trailing zeros, truthy-vs-guard mismatch). The chain produced a materially better result than any single pass would have.

---

## Entry 5: Architecture Decision Records & Story Verification

**Date:** 2026-06-12

---

### ADR-004 — Background Job Processing Strategy

Consulted the system architect agent to generate a formal ADR comparing three options for background job handling:

| Option | Verdict |
|--------|---------|
| BullMQ (Node.js + Redis) | Rejected — introduces a second backend runtime and Redis into a plain-PHP project |
| Database-backed queue (MySQL `jobs` table) | Recommended — same language, same MySQL path already scaffolded, transparent to a trainee |
| Azure Service Bus | Rejected — enterprise cloud infrastructure applied to a `localhost`-only training sprint with zero messages to process |

**Decision:** Defer implementation entirely. ScentStore has no background jobs today — one read-only endpoint serving static JSON. Building queue infrastructure before a concrete use case exists violates the project's complexity cap.

**What I learned:** The architect's reasoning was scale-aware, not just technically correct. "Reject Azure Service Bus" is obvious in hindsight, but the more interesting insight was rejecting BullMQ for the same reason: it's the right tool for a Node.js project, not a PHP one — introducing it here would mean two backend runtimes for a problem that doesn't exist yet. The database-backed queue wins not because it's the best queue at scale, but because it's the most appropriate match for this project's actual constraints and learning objectives.

ADR saved to `docs/adr/004-background-job-processing.md`.

---

### US-05 — Filter Products by Category (Already Done)

Ran the `/z-implement-story` workflow for US-05. The codebase scout found the feature was already fully implemented before planning began.

**All 5 acceptance criteria were already met:**

1. Dropdown with All Categories, Floral, Woody, Citrus, Oriental — `categories` array in `product-listing.component.ts`
2. Selecting a category immediately filters the grid — `onCategoryChange()` filters `allProducts` in-memory
3. "All Categories" restores the full list — empty string value falls through to `[...this.allProducts]`
4. Empty state message — `@if (filteredProducts.length === 0)` renders "No perfumes found in this category."
5. Client-side only, no additional API call — full list fetched once in `ngOnInit`, filtered in memory thereafter

### What I learned: The implement-story workflow's parallel reconnaissance phase (codebase scout running alongside story fetch) caught the redundancy before any planning work was done. This is the right moment to catch it — not after writing a plan, not after starting a branch. The cost of the check was low; the cost of re-implementing a working feature would have been higher. When a story is marked as a dependency of another story (US-05 depends on US-04), it's worth verifying current state before assuming there's work to do.

---

## Client Application Ideas — How ScentStore Patterns Apply to Real Projects

The patterns and constraints demonstrated in ScentStore translate directly to professional consulting engagements. Here are three specific scenarios where this exact architecture would be valuable:

### Idea 1: Legacy PHP Backend Modernisation (Angular Frontend Retrofit)

**Scenario:** A mid-market client has a 15-year-old PHP e-commerce site running on Apache with thousands of SKUs in a MySQL database. The business wants a modern Angular interface without a full rewrite of the backend.

**How ScentStore applies:**
- ScentStore's service layer pattern (`ProductService` as the HTTP facade) provides a clean boundary between old PHP and new Angular
- The plain PHP API in ScentStore matches the client's no-framework constraint — they don't have Laravel expertise, and adding a framework introduces risk
- Environment-based API URL switching (`environment.ts` vs `environment.production.ts`) handles the deployment scenario cleanly: dev points to local PHP, staging/prod point to cloud or on-premise PHP servers
- The CORS header pattern in `backend/api/products.php` is production-ready; adding explicit origin checks is straightforward

**Concrete example:** Replace the JSON file with a MySQL query (`SELECT * FROM products WHERE category = $category`), keep the PHP endpoint structure identical, and the Angular app requires zero changes. The service layer shields the frontend from the backend migration.

---

### Idea 2: PrimeNG-Accelerated Dashboard / Admin Portal

**Scenario:** A financial services client needs a new internal dashboard to manage client portfolios, display performance charts, and filter client lists by asset class. The UX team designed in Figma; the timeline is 6 weeks.

**How ScentStore applies:**
- PrimeNG's data-display components (`Card`, `Dropdown`, `Carousel` in ScentStore; `DataTable`, `Chart`, `MultiSelect` in production) provide a consistent, accessible UI library without custom component work
- ScentStore's responsive grid and carousel implementation proves that PrimeNG scales cleanly from mobile to desktop — the client's dashboard must work on tablets in the trading floor
- The lightweight SCSS styling (ScentStore uses only `.lara-light-indigo` theme + minimal custom rules) mirrors the pattern: purchase a PrimeNG theme, customise sparingly, avoid CSS bloat
- Centralised service layer (`ProductService` pattern) scales to multiple data sources: one service for portfolios, one for alerts, one for historical data — each independently testable and swappable

**Concrete example:** The Financial client's `PortfolioService` follows the exact pattern as ScentStore's `ProductService`: centralised HTTP, typed observables, environment-aware URLs. The team trains once on the pattern, reuses it across six feature modules, and tests it once.

---

### Idea 3: Multi-Tenant SaaS MVP with Lightweight Auth

**Scenario:** A startup is building a SaaS platform for small logistics companies to track shipments. They need a working MVP in 8 weeks with minimal infrastructure — no Kubernetes, no complex CI/CD, no data warehouse.

**How ScentStore applies:**
- ScentStore's static JSON approach (in dev) is exactly how an MVP manages data without premature database setup. Ship with JSON, migrate to MySQL later when scale demands it — the service layer makes the migration transparent
- ADR-004 (Authentication Approach) explicitly documents why auth is deferred in ScentStore and provides a concrete path forward (JWT + route guards + PHP validation). The startup can ship without auth in week 1, add it in week 3, and never refactor twice
- Plain PHP with no framework means deployment is simple: `scp` files to a shared hosting provider, set environment variables, run `php -S` for local development — no Docker, no Node build step on the server
- The "Things to Avoid" list in CLAUDE.md (no LaravelI Foundation, no ORM, no real-time stock) is exactly the complexity that a startup MVP should dodge. These are deliberate deferral decisions, not oversights

**Concrete example:** The MVP ships with hard-coded shipment data in `backend/data/shipments.json`, basic filtering in Angular, and public API endpoints. No auth needed. In week 4, when the first paying customer signs up, the startup adds JWT auth (ADR-004's recommended path) and a MySQL migration (replacing the JSON file). The service layer absorbs all the change; components don't know.

---

### Key Insight Across All Three Ideas

All three scenarios share the core pattern ScentStore demonstrates: **clear separation of concerns (service layer), environment-aware configuration (environment files), and deliberate deferral of out-of-scope complexity (ADRs as contracts).** These aren't advanced architectural patterns — they're fundamentals that scale from a 2-week training project to production systems. The value of ScentStore is proving that these patterns work at small scale, so trainees understand why they matter at large scale.
