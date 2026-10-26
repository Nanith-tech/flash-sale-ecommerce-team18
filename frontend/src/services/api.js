import { products } from '../data/catalog';

// Frontend-only adapter. Inventory and orders are illustrative browser data.
const STORAGE_KEY = 'drop-demo-v1';
let memoryState;
function initialState() {
  const now = Date.now();
  return {
    startsAt: new Date(now - 3600000).toISOString(),
    endsAt: new Date(now + 36 * 3600000).toISOString(),
    stock: Object.fromEntries(products.map((p) => [p.id, p.stock])),
    orders: {},
  };
}
function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (
      saved &&
      Number.isFinite(Date.parse(saved.startsAt)) &&
      Number.isFinite(Date.parse(saved.endsAt)) &&
      saved.stock &&
      typeof saved.stock === 'object' &&
      saved.orders &&
      typeof saved.orders === 'object'
    ) {
      return {
        ...saved,
        stock: Object.fromEntries(
          products.map((p) => [
            p.id,
            Number.isInteger(saved.stock[p.id]) &&
            saved.stock[p.id] >= 0 &&
            saved.stock[p.id] <= p.initialStock
              ? saved.stock[p.id]
              : p.stock,
          ]),
        ),
      };
    }
  } catch {
    /* Browsing can disable storage. Use this tab's memory. */
  }
  return memoryState || initialState();
}
function saveState(state) {
  memoryState = state;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* Keep the demo usable without storage. */
  }
}
const pause = () => new Promise((resolve) => setTimeout(resolve, 280));
export async function fetchCatalog() {
  await pause();
  const state = loadState();
  saveState(state);
  const now = Date.now();
  return {
    serverTime: new Date(now).toISOString(),
    sale: {
      id: 'weekend-drop',
      name: 'The Weekend Drop',
      startsAt: state.startsAt,
      endsAt: state.endsAt,
      status:
        now < Date.parse(state.startsAt)
          ? 'UPCOMING'
          : now >= Date.parse(state.endsAt)
            ? 'ENDED'
            : 'ACTIVE',
    },
    products: products.map((p) => ({ ...p, stock: state.stock[p.id] })),
  };
}
export async function placeOrder(items, key) {
  await pause();
  const state = loadState();
  const fingerprint = JSON.stringify(
    items
      .map(({ productId, quantity }) => ({ productId, quantity }))
      .sort((a, b) => a.productId.localeCompare(b.productId)),
  );
  if (state.orders[key]) {
    if (state.orders[key].fingerprint !== fingerprint)
      throw new Error('Your bag changed. Please start a new checkout.');
    return { order: state.orders[key].order, replayed: true };
  }
  if (!items.length || new Set(items.map((i) => i.productId)).size !== items.length)
    throw new Error('Add a product to your bag before checking out.');
  const now = Date.now();
  if (now < Date.parse(state.startsAt)) throw new Error('This demo drop has not started yet.');
  if (now >= Date.parse(state.endsAt))
    throw new Error('This demo drop has ended. Your order was not placed.');
  const lines = items.map(({ productId, quantity }) => {
    const product = products.find((p) => p.id === productId);
    if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 10)
      throw new Error('Check the items and quantities in your bag.');
    if (quantity > state.stock[productId])
      throw new Error(
        `${product.name} has only ${state.stock[productId]} left in this demo. Update your bag and try again.`,
      );
    return {
      productId,
      quantity,
      unitPrice: product.salePrice,
      subtotal: product.salePrice * quantity,
    };
  });
  const order = {
    id: crypto.randomUUID(),
    reference: `DEMO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
    total: lines.reduce((sum, line) => sum + line.subtotal, 0),
    items: lines,
    status: 'CONFIRMED',
  };
  for (const line of lines) state.stock[line.productId] -= line.quantity;
  state.orders[key] = { order, fingerprint };
  saveState(state);
  return { order, replayed: false };
}
