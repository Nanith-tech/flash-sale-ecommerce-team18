const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
});
export const money = (cents) => formatter.format(cents / 100);
export const discount = (product) =>
  Math.round((1 - product.salePrice / product.originalPrice) * 100);
export const cartTotal = (items) =>
  items.reduce((total, item) => total + item.product.salePrice * item.quantity, 0);
export function remainingTime(endsAt, serverTimestamp, elapsed = 0) {
  const remaining = Math.max(0, new Date(endsAt).getTime() - (serverTimestamp + elapsed));
  const seconds = Math.ceil(remaining / 1000);
  return {
    total: remaining,
    days: Math.floor(seconds / 86400),
    hours: Math.floor(seconds / 3600) % 24,
    minutes: Math.floor(seconds / 60) % 60,
    seconds: seconds % 60,
  };
}
