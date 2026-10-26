# Learning roadmap

1. **Requirements:** compare PRODUCT.md with the brief; understand why this phase delivers only the frontend.
2. **Design:** trace DESIGN.md into CSS tokens, typography, photography, grid and responsive breakpoints.
3. **React:** follow product data through cards, details and cart; distinguish local state from derived values.
4. **Service boundary:** inspect the asynchronous demo adapter and the loading/error recovery around it.
5. **Persistence:** examine versioned localStorage keys and explain why browser storage is not a shared database.
6. **Time and inventory:** understand timestamp-derived countdowns, interval cleanup and illustrative stock updates.
7. **Checkout:** follow quantity validation, integer totals, pending state and repeated-request handling.
8. **UX:** use the app by keyboard, test native dialog Escape/focus behavior, and enable reduced motion.
9. **Verification:** run Vitest and React Testing Library tests, ESLint and the Vite production build.
10. **Future full stack:** replace the adapter with validated APIs and a real transactional database only when backend implementation is in scope.

Useful exercises: add a category with meaningful empty states; add a product without changing component code; test an expired sale; simulate a failed checkout and preserve the bag; explain which inventory protections cannot be implemented securely in a browser.
