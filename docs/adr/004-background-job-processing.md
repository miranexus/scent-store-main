# ADR-004: Background Job Processing Strategy

**Status:** Proposed
**Date:** 2026-06-12

## Context

As ScentStore matures beyond its initial training sprint, certain operations may benefit from asynchronous processing rather than being handled synchronously within the PHP request lifecycle. Potential use cases include:

- **Image processing** — resizing or optimising product images after upload
- **Email notifications** — sending order confirmations or promotional emails (if commerce features are added later)
- **Data import/export** — bulk loading product data from CSV or external feeds
- **Cache warming** — pre-generating filtered product responses after data changes

However, the current state of the project must be weighed heavily:

- The backend is **plain PHP 8** with no framework (no Laravel, no Symfony). There is no built-in queue abstraction, middleware layer, or CLI task runner.
- The data source is a **static JSON file** (`backend/data/products.json`). There is no database — MySQL is scaffolded in `backend/config/database.php` but commented out and inactive.
- The project is a **2--4 week training sprint** for learning Angular/PHP integration. The PRD explicitly excludes auth, cart, checkout, admin, and real-time features.
- The only backend entry point is a single endpoint (`GET /api/products.php`) that reads a JSON file and returns filtered results. There are no write operations.
- The project runs locally via `php -S localhost:8080` and `ng serve`. There is no deployed infrastructure.

The question is: **if background job processing were needed, which approach fits this project's constraints and scale?**

## Options Considered

### Option A — In-Process Job Queue (BullMQ / Redis-backed, Node.js)

**Description:** BullMQ is a Redis-backed job queue for Node.js. Jobs are enqueued by a producer (typically an API handler) and consumed by a worker process. It provides retry logic, delayed jobs, rate limiting, job prioritisation, and a dashboard (Bull Board) for monitoring.

**Pros:**
- Battle-tested in production Node.js applications; large ecosystem and community
- Rich feature set: retries, backoff, cron scheduling, concurrency control, dead-letter queues
- Redis provides persistence and pub/sub — jobs survive process restarts
- Bull Board offers a visual dashboard for queue monitoring

**Cons:**
- **Requires Node.js runtime** — ScentStore's backend is PHP. Introducing Node.js means running a second backend runtime, a second process, and maintaining two server-side languages. This directly contradicts the project's simplicity constraints.
- **Requires Redis** — a new infrastructure dependency that must be installed, configured, and run alongside the PHP dev server and Angular CLI. No Redis exists in the current setup.
- **Wrong technology stack** — PHP cannot natively enqueue BullMQ jobs without an HTTP bridge or shared Redis protocol library. The PHP side would need to write directly to Redis using a PHP Redis client, tightly coupling the two runtimes at the data layer.
- **Massive overhead for the learning objective** — the training sprint is about Angular/PHP integration, not polyglot backend architecture.

**Fit with current stack:** Poor. Introduces two new infrastructure components (Node.js runtime, Redis) and a second backend language into a project that explicitly chose plain PHP for its zero-dependency simplicity (see ADR-001).

---

### Option B — Database-Backed Queue (MySQL jobs table, polled by PHP)

**Description:** A `jobs` table in MySQL stores pending tasks (payload, status, retry count, scheduled time). A PHP CLI script (run via `cron` or a loop) polls the table periodically, picks up unprocessed rows, executes them, and marks them complete or failed.

**Pros:**
- **Same language** — both the API and the worker are PHP. No new runtime to learn or operate.
- **No new infrastructure beyond MySQL** — the project already has a MySQL scaffold in `database.php`. Activating it and adding a `jobs` table is incremental, not architectural.
- **Transparent and debuggable** — trainees can inspect the queue by running `SELECT * FROM jobs`. The entire mechanism is visible SQL — no opaque broker protocol.
- **Teaches a real pattern** — database-backed queues are how many PHP applications (including early Laravel versions) handled background work before dedicated queue brokers became standard.
- **Simple to implement** — a jobs table schema, an enqueue function (`INSERT INTO jobs`), and a worker script (`SELECT ... WHERE status = 'pending' LIMIT 1 FOR UPDATE`) can be written in under 100 lines of PHP.

**Cons:**
- **Requires MySQL** — the database is currently inactive. Activating it means installing MySQL, creating the schema, and updating the data layer. This is planned work (the scaffold exists) but is not yet done.
- **Polling is inefficient** — the worker checks for new jobs on a timer (e.g., every 5 seconds). This adds latency compared to push-based systems and wastes cycles when the queue is empty. For a training project with near-zero throughput, this is irrelevant in practice.
- **No built-in retry/backoff/dead-letter** — these must be implemented manually (a `retry_count` column, exponential delay logic). For a learning project, implementing these from scratch is arguably a feature, not a bug.
- **Row-locking complexity** — concurrent workers require `SELECT ... FOR UPDATE` or advisory locks to avoid double-processing. With a single worker (appropriate for this project), this is not a concern.
- **Not production-grade at scale** — database queues degrade under high throughput because every enqueue/dequeue is a transactional write. Irrelevant at ScentStore's scale (zero background jobs today, single-digit hypothetical).

**Fit with current stack:** Good, conditional on MySQL activation. Uses the same language, aligns with the planned database migration path, and is fully understandable by a trainee learning PHP.

---

### Option C — External Managed Service (Azure Service Bus)

**Description:** Azure Service Bus is a fully managed enterprise message broker supporting queues and publish/subscribe topics. Messages are enqueued via an HTTPS REST API or SDK, and consumed by subscribers polling or receiving push notifications.

**Pros:**
- **Fully managed** — no infrastructure to install, patch, or monitor. Microsoft handles availability, scaling, and persistence.
- **Enterprise-grade features** — dead-letter queues, message sessions, duplicate detection, scheduled delivery, transactions, and geo-disaster recovery out of the box.
- **HTTPS API** — PHP can enqueue messages via `curl` or `file_get_contents` to the REST API without an SDK, which aligns with the no-framework constraint.
- **Decoupled architecture** — producers and consumers are fully independent; the broker handles delivery guarantees.

**Cons:**
- **Requires an Azure subscription** — introduces cloud dependency, billing, authentication (SAS tokens or Azure AD), and networking configuration. The project currently runs entirely on `localhost` with no cloud services.
- **Massive complexity mismatch** — Azure Service Bus is designed for distributed enterprise systems processing thousands of messages per second. ScentStore has zero background jobs and a static JSON data source. This is the definition of premature infrastructure.
- **Authentication and configuration overhead** — even the simplest Service Bus setup requires creating a namespace, a queue, generating SAS keys, and managing connection strings. This is more infrastructure work than the entire current backend.
- **Cost** — while the Basic tier is inexpensive, any cost is disproportionate for a training project with no production deployment and no actual messages to process.
- **Opaque** — trainees cannot inspect the queue by looking at a database table or a log file. Debugging requires the Azure Portal or Service Bus Explorer, adding tool surface area.

**Fit with current stack:** Poor. Introduces cloud infrastructure, billing, and authentication into a project that runs on two terminal commands (`php -S` and `ng serve`). The operational complexity dwarfs the problem it would solve.

## Decision

**Recommended: Option B — Database-Backed Queue (MySQL jobs table), but only when a concrete use case materialises. Do not implement now.**

The reasoning:

1. **There are no background jobs today.** The project has a single read-only endpoint serving static JSON. There are no write operations, no image uploads, no emails, no data imports. Implementing any queue system now would be building infrastructure for a problem that does not exist. This violates the project's core constraint: complexity is capped to ensure completion within the sprint timeline.

2. **When the need arises, Option B is the right fit.** If ScentStore grows to include product management (writes), image handling, or email — likely coinciding with the planned MySQL migration — a database-backed queue is the simplest option that works:
   - Same language (PHP) as the existing backend
   - Same infrastructure (MySQL) as the planned data migration
   - Fully transparent and debuggable for a trainee
   - Implementable in under 100 lines of PHP with no external dependencies
   - Teaches a foundational pattern that applies to larger frameworks (Laravel's `database` queue driver uses exactly this approach)

3. **Option A (BullMQ) is rejected** because it introduces a second backend runtime (Node.js) and a new infrastructure dependency (Redis) into a project that chose plain PHP specifically for zero-dependency simplicity. The complexity is not justified by any current or near-term requirement.

4. **Option C (Azure Service Bus) is rejected** because it introduces cloud infrastructure, billing, and authentication into a localhost-only training project. It is enterprise tooling applied to a problem that does not yet exist, at a scale that will never justify it within this project's scope.

**The decision is to defer implementation entirely and revisit this ADR if and when a specific user story introduces a background processing requirement.**

## Consequences

### Positive

- **Zero implementation cost now.** No new dependencies, no new infrastructure, no new code. The project stays focused on its learning objective: Angular/PHP integration.
- **Clear upgrade path.** When MySQL is activated (the scaffold already exists in `database.php`), adding a `jobs` table is a small incremental step, not an architectural change.
- **Trainee-appropriate complexity.** A database-backed queue is fully understandable with PHP and SQL knowledge the trainee is already building. No new languages, runtimes, or cloud services to learn.
- **Pattern transferability.** Understanding database-backed queues prepares the trainee for Laravel's queue system, which uses the same pattern with a `jobs` table and a `php artisan queue:work` CLI worker.

### Negative

- **No background processing capability today.** If a use case appeared tomorrow, there would be implementation lead time. Given the project scope (no writes, no uploads, no emails), this is an acceptable trade-off.
- **Database-backed queues have a throughput ceiling.** If ScentStore somehow grew to require high-throughput async processing (thousands of jobs per minute), a dedicated broker like Redis or a managed service would be needed. This scenario is far outside the project's scope.
- **Polling latency.** When eventually implemented, the PHP worker will poll on a timer rather than receiving push notifications. Jobs will have a processing delay equal to the poll interval (typically 1--5 seconds). For the anticipated use cases (image resize, email), this latency is imperceptible.

### Risks

- **Premature implementation pressure.** There is a risk that the existence of this ADR creates a temptation to build the queue "while we're at it" before a concrete use case justifies it. The recommendation is explicit: do not implement until a user story requires it.
- **MySQL activation dependency.** Option B requires the MySQL migration to be completed first. If that migration is deferred indefinitely, and a background job need arises, a file-based queue (writing job payloads as JSON files to a `jobs/` directory, processed by a PHP CLI script) could serve as an interim step using the same architectural pattern with zero infrastructure dependencies.

### Implementation Changes Required (When Triggered)

1. **Activate MySQL** — uncomment `getDbConnection()` in `backend/config/database.php` and create the database
2. **Create a `jobs` table** — columns: `id`, `type`, `payload` (JSON), `status` (pending/processing/completed/failed), `attempts`, `created_at`, `processed_at`
3. **Write an enqueue function** — a PHP function that inserts a row into the `jobs` table
4. **Write a worker script** — a PHP CLI script (`backend/worker.php`) that polls the table, processes one job at a time, and updates the status
5. **Run the worker** — via `php backend/worker.php` in a third terminal during development, or via `cron` in a deployed environment
