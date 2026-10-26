# Frontend service contract

No HTTP requests are made in the current version. `frontend/src/services/api.js` exposes an asynchronous interface that can later be connected to an API.

## fetchCatalog()

Returns `{ serverTime, sale, products }`. `serverTime` is currently the browser timestamp, retained in the shape for future integration. `sale` contains `id`, `name`, `startsAt`, `endsAt`, and `status` (`UPCOMING`, `ACTIVE`, `ENDED`). Products contain the fields in `data/catalog.js`, with current browser-local stock.

## placeOrder(items, key)

Accepts an array of `{ productId, quantity }` and a unique checkout key. Quantity must be an integer from 1 to 10. Duplicate product IDs, unavailable quantities and expired sale windows fail with a readable Error. Prices come from the illustrative catalog, not caller input.

Returns `{ order, replayed }`. An order contains `id`, `reference`, `total` in cents, `items`, and `status`. References start with `DEMO-`. Repeating the same key and bag returns the original order; reusing it with different items fails.

```js
await placeOrder([{ productId: 'headphones', quantity: 2 }], crypto.randomUUID());
// { order: { reference: 'DEMO-…', total: 29800, ... }, replayed: false }
```

To integrate later, replace the adapter methods with fetch calls, keep these shapes, and move all authoritative checks into the server. Do not treat this demo as a real stock API.
