# Frontend architecture

`App.jsx` composes the storefront and owns the bag, filters, dialog selection and checkout state. Each product card, quantity control, stock indicator and dialog owns a small presentation responsibility. Local state is sufficient for this single-page flow; a global state library would add complexity without solving a current problem.

`usePersistentState` hydrates and validates browser storage, then synchronizes updates. Cart entries store only product IDs and integer quantities, so current catalog prices are used for display. Product details and filtered results are derived at render time rather than copied into state.

`useCatalog` loads the asynchronous demo adapter, rejects stale responses and refreshes when the tab becomes visible. A 15-second interval refreshes illustrative stock only while visible. Both listeners and intervals clean up on unmount. Countdown ticks are isolated in `CountdownTimer` so the full product collection does not rerender every second.

The countdown derives remaining time from the stored deadline, a time snapshot and `performance.now()`. This avoids accumulating interval drift. The local demo clock is not a security boundary. The component exposes expired/upcoming eligibility to the parent so purchase controls become unavailable.

## Request flow

1. `useCatalog` calls `fetchCatalog()` in `services/api.js`.
2. The adapter returns the static catalog merged with browser-local stock and the persistent demo deadline.
3. A product adds its ID and quantity to the bag; inventory does not change.
4. Cart totals derive from integer catalog prices and quantity.
5. Checkout calls `placeOrder(items, idempotencyKey)`. The adapter validates every line before updating stock and creates a demo receipt.
6. The UI clears the bag, refreshes the catalog and shows confirmation. Errors preserve the bag and allow recovery.

Native `<dialog>` supplies focus containment and Escape semantics. The wrapper locks page scrolling and returns focus to the opener on close. Reduced motion is handled in CSS. Theme tokens are canonical in `styles/tokens.css`; DESIGN.md explains their purpose.

Backend integration is intentionally deferred. Nothing in the frontend imports backend source.
