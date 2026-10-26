# DROP

An educational, frontend-only flash-sale shop for shoppers discovering thoughtfully designed tech and everyday goods. The main task is to browse a time-limited collection, review illustrative availability, and complete a simulated purchase. No real payments, accounts, or shipping promises.

## Platform and stack

Web, English, USD. React and Vite with JavaScript and plain CSS. Browser demo data lives behind a service adapter. Money uses integer cents. Backend integration is deferred per user instruction.

## Product rules

Cart additions do not reserve inventory. Simulated checkout validates the demo catalog and accepts a browser-local idempotency key. The demo sale window persists in localStorage and can expire; it is not a secure or shared inventory service. Cart, saved finds, stock and demo orders persist in this browser. Product and offer details are illustrative seed content.

## Success

A responsive, distinctive frontend with a complete keyboard-accessible browse-to-demo-order flow, meaningful frontend tests and setup documentation. Existing solar-monitor files stay untouched. Earlier backend scaffolding is inactive and unverified; do not build it in this phase.
