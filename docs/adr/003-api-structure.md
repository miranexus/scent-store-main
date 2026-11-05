# ADR-003: API Structure

**Status:** Accepted
**Date:** 2026-05-28

## Context

The Angular frontend needs to retrieve product data from the PHP backend. A decision is needed on how the API is structured: how many endpoints, what URL conventions to use, how filtering is handled, and how CORS is managed.

The constraints are:
- Plain PHP 8 with no routing framework
- Single resource type (products) in scope
- One UI-driven filter parameter (category)
- Must not introduce complexity beyond the sprint timeline

## Options Considered

### Option A — Single endpoint, client-side filtering only
`GET /api/products.php` always returns all products. Angular filters in-memory.

Partially adopted: client-side filtering is used for the category dropdown (US-05) to avoid extra HTTP calls on each selection change. However, the endpoint still supports server-side filtering for completeness and to demonstrate the pattern.

### Option B — Single endpoint with optional query parameter
`GET /api/products.php` returns all products by default.
`GET /api/products.php?category=Floral` returns filtered results.

Accepted: Teaches the query-parameter filtering pattern without requiring a routing framework. The Angular service passes the parameter via `HttpParams`; PHP reads it via `$_GET`.

### Option C — RESTful resource-based routing
`GET /api/products` (no `.php` extension), with an Apache/Nginx rewrite rule mapping paths to controllers.

Rejected: Requires `.htaccess` rewrite configuration and URL routing logic — infrastructure overhead that is out of scope. The `.php` extension in the URL is an acceptable trade-off for the training context.

### Option D — Multiple specialised endpoints
`GET /api/featured.php`, `GET /api/special-offers.php`, `GET /api/products.php`

Rejected: Duplicates filtering logic across files, encourages Angular components to manage their own API concerns rather than delegating to a service, and does not scale.

## Decision

**Single endpoint:** `GET /api/products.php`

- Returns the full product array by default (HTTP 200, `Content-Type: application/json`)
- Accepts an optional `?category=` query parameter for server-side filtering
- Returns `[]` for an unmatched category (not a 404)
- Returns HTTP 405 for non-GET methods
- CORS headers allow `http://localhost:4200` (Angular dev server)
- Input is sanitised with `htmlspecialchars` / `strip_tags` before use

All HTTP communication in Angular is centralised in `ProductService` (`core/services/product.service.ts`). Components never call `HttpClient` directly — this is the key architectural pattern the service layer teaches.

### URL summary

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/products.php` | All products |
| GET | `/api/products.php?category=Floral` | Products filtered by category |

## Consequences

### Positive
- One file to understand for the entire backend — low cognitive overhead for trainees
- The `?category=` pattern demonstrates server-side filtering, even though the UI currently filters client-side
- Centralising HTTP in `ProductService` means components are decoupled from the API shape; changing the URL or adding pagination only requires editing one file
- CORS is explicit and visible — trainees can see exactly why the header is needed

### Negative / Trade-offs
- The `.php` extension in the URL is not idiomatic for a REST API; a production system would use URL rewriting
- No API versioning (e.g. `/api/v1/products`) — adding a breaking change requires coordinating frontend and backend simultaneously
- No pagination — returning all products in one response will not scale beyond a few hundred records
- CORS origin is hardcoded to `localhost:4200`; a production deployment requires updating this header (or using an environment variable)
- No HTTP caching headers (`ETag`, `Cache-Control`) — every request fetches fresh data even when nothing has changed
