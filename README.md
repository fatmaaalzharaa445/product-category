# Product Catalog

A responsive product catalog with full CRUD, built with **Next.js 16 (App Router)**, **TypeScript (strict)** and **Tailwind CSS v4**. Data comes from [DummyJSON](https://dummyjson.com/products).


## Routes

| Route                 | Purpose                                                
| `/`                   | Redirects to `/products`                                   |
| `/products`           | Listing: search, category filter, sort, pagination         |
| `/products/new`       | Create form                                                |
| `/products/[id]`      | Details page with a per-product title, plus edit and delete |
| `/products/[id]/edit` | Edit form (the same component as create)                  |

Invalid ids (`/products/abc`) and ids the API doesn't know (`/products/99999`) render the not-found view.

## Project structure

```
app/                     Routes, metadata, not-found and error boundaries
components/
  layout/                Header, active nav link, page header
  products/              Catalog, card, form, details, delete dialog, skeletons, status panels
  ui/                    Shared styles, star rating, toaster
lib/
  types.ts               Domain models (Product, ProductInput, CatalogQuery…)
  api/                   Data layer: the only code that calls fetch
    products.ts          Typed service: list, get, create, update, delete
    products.server.ts   Cached server read ("use cache") for pages and metadata
    parse.ts             Runtime narrowing of API JSON from `unknown` (no `any`)
  catalog/               Pure logic: query parsing, filtering and sorting, validation, ids
  store/                 Client state: local catalog changes and toasts
```

## UX and accessibility

- Explicit **loading** (skeletons), **empty** (with a "clear filters" action) and **error** (with retry) states.
- Delete always asks for **confirmation** in a native `<dialog>`, which traps focus and closes on Escape.
- Semantic landmarks, a skip link, `aria-current` on active nav and pagination links, visible focus rings, a live region for result counts and toasts, and color tokens that meet AA contrast in light and dark mode.
- Mobile-first layout from 360px. Hover and focus states, card lift, fade-in transitions, and support for `prefers-reduced-motion`.
