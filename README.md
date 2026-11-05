# ScentStore — Training Project

A full-stack training project demonstrating end-to-end integration between an **Angular 18** frontend and a **PHP** backend, built around a fictional perfume e-commerce store.

See [`docs/pdr.md`](docs/pdr.md) for the full Product Requirements Document.

---

## Technology Stack

| Layer     | Technology                              |
| --------- | --------------------------------------- |
| Frontend  | Angular 18, PrimeNG 17, SCSS            |
| Backend   | PHP 8.x (built-in server / Apache)      |
| Data      | Static JSON file (`backend/data/`)      |
| Icons     | PrimeIcons                              |

---

## Project Structure

```
├── backend/
│   ├── api/
│   │   └── products.php        # GET /api/products.php endpoint
│   ├── config/
│   │   └── database.php        # MySQL config (unused — see file for notes)
│   ├── data/
│   │   └── products.json       # Static product catalogue (12 items)
│   └── index.php               # Redirect entry point
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── core/services/
    │   │   │   └── product.service.ts      # HTTP layer — all API calls go here
    │   │   ├── shared/models/
    │   │   │   └── product.model.ts        # Product TypeScript interface
    │   │   ├── features/
    │   │   │   ├── carousel/               # Featured + Special Offers carousels
    │   │   │   └── product-listing/        # Filterable product grid
    │   │   ├── app.component.*             # Root shell (header/footer)
    │   │   ├── app.config.ts               # Angular providers
    │   │   └── app.routes.ts               # Client-side routes (empty for now)
    │   ├── environments/
    │   │   ├── environment.ts              # Dev: points to localhost:8080
    │   │   └── environment.production.ts   # Prod: relative /api path
    │   └── styles.scss                     # Global styles
    ├── angular.json
    ├── package.json
    └── tsconfig.json
```

---

## Prerequisites

- **Node.js** 18 or later (`node -v`)
- **npm** 9 or later (`npm -v`)
- **Angular CLI** 18 (`npm install -g @angular/cli`)
- **PHP** 8.0 or later (`php -v`)

---

## Getting Started

### 1. Start the PHP backend

```bash
# From the repo root — serves backend/ on http://localhost:8080
php -S localhost:8080 -t backend
```

Test it: `http://localhost:8080/api/products.php`

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

### 3. Start the Angular dev server

```bash
# Still inside frontend/
ng serve
```

The app is available at **http://localhost:4200**.

> The dev environment (`src/environments/environment.ts`) is pre-configured to call `http://localhost:8080/api/products.php`. No changes needed for local development.

---

## Build for Production

```bash
cd frontend
ng build
```

Output lands in `frontend/dist/scentstore/`. Deploy this alongside your PHP backend on any web server (Apache / Nginx). Update `backend/api/products.php` CORS headers for your production domain.

---

## Running Tests

```bash
cd frontend
ng test
```

---

## Features

- **Product Carousel** — PrimeNG `p-carousel` showcasing featured perfumes and special-offer items with auto-rotation and responsive breakpoints.
- **Product Grid** — All 12 products displayed in a responsive CSS grid using PrimeNG `p-card`.
- **Category Filter** — Client-side filtering by Floral / Woody / Citrus / Oriental via PrimeNG `p-dropdown`.
- **PHP REST Endpoint** — `GET /api/products.php?category=Floral` returns a filtered JSON array.

## Out of Scope

User authentication, shopping cart, checkout, admin dashboard, and real-time inventory — see the PRD for rationale.
