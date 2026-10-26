# Browser data in the frontend phase

No database is used or required. The inactive `backend/prisma` scaffold predates the frontend-only scope and is not a verified backend deliverable.

The demo catalog in `frontend/src/data/catalog.js` defines immutable product IDs, names, image paths, categories, original/sale prices in cents and initial availability. The adapter merges stock from localStorage.

## Storage records

| Key             | Contents                                                      |
| --------------- | ------------------------------------------------------------- |
| `drop-demo-v1`  | ISO sale window, product-ID-to-stock map, simulated order map |
| `drop-bag-v1`   | Array of product IDs and integer quantities                   |
| `drop-saved-v1` | Array of saved product IDs                                    |

The adapter checks every requested quantity and catalog price before writing stock. A failing line leaves stock untouched in this tab. Repeating the same checkout key returns the same receipt; changing the bag under a used key fails. This is a frontend simulation, not transactional shared inventory. Multiple browser profiles have independent data; simultaneous tabs are not a database concurrency guarantee.

When a real backend is added, it must own sale eligibility, price calculation, transactions, inventory constraints and idempotency. Frontend validation improves feedback but cannot secure purchases.
