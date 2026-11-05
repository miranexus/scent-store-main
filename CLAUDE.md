# Project: ScentStore

## What This Is
ScentStore is a 2–4 week training sprint demonstrating Angular + PHP integration through a perfume e-commerce interface. It serves as a learning project — not a production application — for a developer building familiarity with Angular 18 standalone components and a plain PHP 8 API backend.

## Tech Stack
- Language: TypeScript (Angular frontend), PHP 8 (backend)
- Framework: Angular 18 with PrimeNG 17 component library
- Data: Static JSON file (`backend/data/products.json`) — no live database yet
- Styling: SCSS with PrimeNG lara-light-indigo theme

## Project Structure
```
backend/
  api/          # PHP endpoint(s)
  config/       # Database scaffold (future MySQL migration)
  data/         # Static JSON data source
frontend/src/
  app/
    core/services/    # HTTP service layer (product.service.ts)
    features/         # carousel/, product-listing/
    shared/models/    # Product interface
  environments/       # Dev and prod API URL config
```

## Key Commands
```bash
# Terminal 1 — backend
php -S localhost:8080 -t backend

# Terminal 2 — frontend
cd frontend && npm install && ng serve
```

## Conventions
- Standalone components — no NgModules; each component declares its own PrimeNG imports
- Angular 17+ control flow — `@if` / `@for` (not `*ngIf` / `*ngFor`); no `CommonModule` needed
- `provideHttpClient()` in `app.config.ts`, not `HttpClientModule`
- `provideAnimationsAsync()` required for PrimeNG
- All HTTP calls go through `product.service.ts` — never call `HttpClient` directly in a component
- `Product` interface in `shared/models/product.model.ts` must stay in sync with `products.json` shape

## Things to Avoid
- No PHP frameworks (no Laravel, Symfony, etc.)
- No database ORM — MySQL or static JSON only
- No direct HTTP calls in components — use the service layer
- Do not implement: auth, shopping cart, checkout, admin dashboard, SSR, or real-time stock

## Key Context
The only API endpoint is `backend/api/products.php`, which reads the JSON file and applies an optional `?category=` query param filter. CORS headers are set there. The Angular environment files (`environment.ts` / `environment.production.ts`) control the API base URL and are swapped automatically by `angular.json` `fileReplacements` at build time. `backend/config/database.php` is a placeholder scaffold for a future MySQL migration and does nothing yet.

### Data Model
```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  category: 'Floral' | 'Woody' | 'Citrus' | 'Oriental';
  featured: boolean;
  specialOffer: boolean;
  discount?: number;  // only present when specialOffer is true
}
```

### PrimeNG Components
| Component | Module | Location |
|-----------|--------|----------|
| `p-carousel` | `CarouselModule` | `carousel.component` |
| `p-card` | `CardModule` | both feature components |
| `p-tag` | `TagModule` | both feature components |
| `p-dropdown` | `DropdownModule` | `product-listing.component` |

Theme CSS is loaded globally via `angular.json` styles array (lara-light-indigo).
