# DROP flash-sale frontend

A React + Vite storefront designed with the Taste and Impeccable guidance: oversized DM Sans typography, a pale lavender hero, real local product photographs, orange actions and a quiet, functional cart drawer.

**Current scope is frontend only.** All products, availability, sale times and order confirmations are illustrative. No payment is taken, no order is sent anywhere, and no backend or database is needed.

## Run locally

Use Node.js 22.12+ or 24 and npm. Open a terminal in this `flash-sale` folder:

```sh
npm install
npm run dev
```

Open http://localhost:5174. The frontend uses port 5174 to avoid conflicting with the existing solar-monitor application.

```sh
npm run build       # production files in frontend/dist
npm run preview     # serve the production build
npm test            # frontend interaction and demo-service tests
npm run lint        # frontend ESLint checks
npm run format      # format source and documentation
```

There are no required environment variables. No PostgreSQL, Prisma engine, API server or `.env` setup is required for this phase. Backend files created before the scope clarification are inactive, not validated and not used by the storefront. The backend is excluded from the npm workspace and startup scripts.

## What works

- Responsive navigation and product collection.
- Persistent 36-hour demo sale window with a timestamp-derived countdown and expired state.
- Category filters, text search, sort by price or saving, and empty-state recovery.
- Saved favorites, accessible product detail dialogs and quantity controls.
- Persistent bag with quantity changes, removal, totals and savings.
- Simulated checkout with pending, error and confirmation states.
- Browser-local stock updates after a demo order; sold-out products cannot be added.
- Keyboard focus, native modal focus containment and Escape handling.
- Local font and image assets, visible focus rings and reduced-motion support.

## Structure

```text
flash-sale/
  frontend/
    public/images/          product photography
    src/
      components/           layout, flash-sale, product, cart, common
      data/catalog.js       illustrative product catalog
      hooks/                catalog synchronization and persistence
      services/api.js       asynchronous browser-only demo adapter
      styles/               tokens and responsive component styles
      utils/format.js       money, cart totals and countdown calculations
      App.jsx               storefront composition and shopping state
    tests/                  React and demo behavior tests
  docs/                     architecture, demo data and learning notes
  DESIGN.md                 durable design intent and token map
  PRODUCT.md                confirmed scope and product behavior
  backend/                  inactive earlier scaffold, deferred
```

## Demo storage

`drop-demo-v1` stores the deadline, stock and demo order receipts. `drop-bag-v1` stores bag IDs and quantities. `drop-saved-v1` stores saved product IDs. Refreshing preserves them; clearing these three keys in browser site storage resets the demo. If browser storage is disabled, the adapter falls back to tab memory.

The sale starts on the first catalog load and expires 36 hours later. It does not silently reset on refresh. To explore the expired state, set `endsAt` in `drop-demo-v1` to a past ISO timestamp and refresh.

## Limits and future integration

Local storage is editable and is not a source of trustworthy inventory or time. Multi-user stock consistency, real orders, payment, tax, shipping, accounts and deployment are outside this frontend phase. A later backend can replace the two methods in `src/services/api.js` while preserving the component-facing catalog and order shapes. See [docs/api.md](docs/api.md).

Images are downloaded from Unsplash and are illustrative, not product supplier photography. Visible brand names and technical specifications in photographs do not establish commercial claims. Product names, prices and descriptions are demo content.

## Troubleshooting

- **Port in use:** stop the other process using 5174, or change the Vite command in `frontend/package.json`.
- **Nothing to buy:** the demo drop may be expired or stock may have been purchased in this browser. Reset the demo storage keys.
- **Saved bag has an old product:** remove the item or clear `drop-bag-v1`.
- **Backend files:** ignore the inactive backend scaffold in this phase; the root install and scripts only target the frontend.
- **Fonts or photos missing:** serve with Vite or `npm run preview`, rather than opening `index.html` directly.

The existing `../solar-monitor` project has not been edited.


## Team 18 Review 1

Project: Flash Sale E-commerce Page with Countdown & Stock Counter.

Team: M Nanith Reddy, Sukka Bhuvaneshwar and P William.

Review files: [Word report](review-1/Team18_Review1.docx) and [PowerPoint presentation](review-1/Team18_Review1_Presentation.pptx).

Current delivery: frontend only, using browser-local demo data. Backend integration remains a future phase.

