import { beforeEach, describe, expect, it, vi } from 'vitest';
let fetchCatalog, placeOrder;
beforeEach(async () => {
  vi.resetModules();
  ({ fetchCatalog, placeOrder } = await import('../src/services/api'));
});
describe('browser demo service', () => {
  it('keeps the sale deadline stable across refreshes', async () => {
    const first = await fetchCatalog();
    const second = await fetchCatalog();
    expect(second.sale.endsAt).toBe(first.sale.endsAt);
  });
  it('uses catalog prices and does not decrement twice on a replay', async () => {
    await fetchCatalog();
    const key = crypto.randomUUID();
    const items = [{ productId: 'headphones', quantity: 2, price: 1 }];
    const first = await placeOrder(items, key);
    const second = await placeOrder(items, key);
    expect(first.order.total).toBe(29800);
    expect(second.replayed).toBe(true);
    expect(second.order.id).toBe(first.order.id);
    const catalog = await fetchCatalog();
    expect(catalog.products.find((p) => p.id === 'headphones').stock).toBe(10);
  });
  it('leaves all stock unchanged when any line is sold out', async () => {
    await fetchCatalog();
    await expect(
      placeOrder(
        [
          { productId: 'headphones', quantity: 1 },
          { productId: 'earbuds', quantity: 1 },
        ],
        crypto.randomUUID(),
      ),
    ).rejects.toThrow(/only 0 left/);
    const catalog = await fetchCatalog();
    expect(catalog.products.find((p) => p.id === 'headphones').stock).toBe(12);
  });
  it('rejects expired demo checkout', async () => {
    await fetchCatalog();
    const state = JSON.parse(localStorage.getItem('drop-demo-v1'));
    state.endsAt = new Date(Date.now() - 10000).toISOString();
    localStorage.setItem('drop-demo-v1', JSON.stringify(state));
    await expect(
      placeOrder([{ productId: 'headphones', quantity: 1 }], crypto.randomUUID()),
    ).rejects.toThrow(/has ended/);
  });
  it('rejects changed items under the same checkout key', async () => {
    await fetchCatalog();
    const key = crypto.randomUUID();
    await placeOrder([{ productId: 'headphones', quantity: 1 }], key);
    await expect(placeOrder([{ productId: 'headphones', quantity: 2 }], key)).rejects.toThrow(
      /bag changed/,
    );
  });
});
