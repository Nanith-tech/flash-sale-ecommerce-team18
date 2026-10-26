import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/App';
import QuantitySelector from '../src/components/product/QuantitySelector';
import ProductCard from '../src/components/product/ProductCard';
import CountdownTimer from '../src/components/flash-sale/CountdownTimer';
import { products } from '../src/data/catalog';
import { cartTotal, money, remainingTime } from '../src/utils/format';

describe('countdown and monetary display', () => {
  it('derives time from timestamps, including a background-tab jump', () => {
    const start = Date.parse('2026-10-23T10:00:00Z');
    expect(remainingTime('2026-10-24T12:03:04Z', start)).toEqual({
      total: 93784000,
      days: 1,
      hours: 2,
      minutes: 3,
      seconds: 4,
    });
    expect(remainingTime('2026-10-24T12:03:04Z', start, 93784001).total).toBe(0);
  });
  it('does not show negative units after expiry', () => {
    expect(remainingTime('2026-10-23T10:00:00Z', Date.parse('2026-10-24T10:00:00Z'))).toEqual({
      total: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });
  });
  it('announces an expired sale and disables eligibility', () => {
    const onExpired = vi.fn();
    render(
      <CountdownTimer
        catalog={{
          sale: { status: 'ENDED', endsAt: new Date(Date.now() - 10000).toISOString() },
          serverTimestamp: Date.now(),
          synchronizedAt: performance.now(),
        }}
        onExpired={onExpired}
      />,
    );
    expect(screen.getByText('This drop has ended')).toBeInTheDocument();
    expect(onExpired).toHaveBeenCalledWith(true);
    expect(screen.getByRole('timer')).toHaveAccessibleName(/0 days, 0 hours, 0 minutes, 0 seconds/);
  });
  it('formats cents and calculates quantities without floating point prices', () => {
    expect(money(14900)).toBe('$149');
    expect(
      cartTotal([
        { product: { salePrice: 14900 }, quantity: 2 },
        { product: { salePrice: 7900 }, quantity: 1 },
      ]),
    ).toBe(37700);
  });
});
describe('product interaction boundaries', () => {
  it('disables the lower and upper quantity bounds', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(
      <QuantitySelector name="Studio Wireless" quantity={1} max={2} onChange={onChange} />,
    );
    expect(screen.getByRole('button', { name: /Decrease/ })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: /Increase/ }));
    expect(onChange).toHaveBeenCalledWith(2);
    rerender(<QuantitySelector name="Studio Wireless" quantity={2} max={2} onChange={onChange} />);
    expect(screen.getByRole('button', { name: /Increase/ })).toBeDisabled();
  });
  it('shows sale and original price, and prevents adding sold-out products', () => {
    const product = products.find((p) => p.stock === 0);
    render(<ProductCard product={product} onSave={vi.fn()} onDetails={vi.fn()} onAdd={vi.fn()} />);
    expect(screen.getByText(money(product.salePrice))).toBeInTheDocument();
    expect(screen.getByText(money(product.originalPrice)).tagName).toBe('DEL');
    expect(screen.getByRole('button', { name: 'Gone for now' })).toBeDisabled();
  });
});
describe('complete frontend shopping flow', () => {
  it('filters and searches, then recovers from an empty result', async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByRole('button', { name: 'View Studio Wireless' });
    await user.click(screen.getByRole('button', { name: 'Workspace', exact: true }));
    expect(screen.getAllByRole('article')).toHaveLength(2);
    await user.type(
      screen.getByRole('textbox', { name: 'Search the collection' }),
      'no matching find',
    );
    expect(screen.getByText('No finds this time.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Explore all finds/ }));
    expect(screen.getAllByRole('article')).toHaveLength(8);
  });
  it('saves a favorite and shows it through the header control', async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByRole('button', { name: 'View Studio Wireless' });
    await user.click(screen.getByRole('button', { name: 'Save Studio Wireless', exact: true }));
    await user.click(screen.getByRole('button', { name: 'Show saved products' }));
    expect(screen.getAllByRole('article')).toHaveLength(1);
    expect(screen.getByRole('heading', { name: 'Your good finds.' })).toBeInTheDocument();
  });
  it('adds, changes quantity and confirms a demo order', async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByRole('button', { name: 'View Studio Wireless' });
    const card = screen
      .getAllByRole('article')
      .find((element) => within(element).queryByRole('button', { name: 'View Studio Wireless' }));
    await user.click(within(card).getByRole('button', { name: 'Add to bag' }));
    await user.click(screen.getByRole('button', { name: 'Bag 1' }));
    const drawer = screen.getByRole('dialog', { name: 'Your bag (1)' });
    await user.click(
      within(drawer).getByRole('button', { name: 'Increase Studio Wireless quantity' }),
    );
    expect(screen.getByRole('dialog', { name: 'Your bag (2)' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Confirm simulated order' }));
    await screen.findByText('A very good find.');
    expect(screen.getByText(/DEMO-/)).toBeInTheDocument();
    expect(screen.getByText('No payment was taken.', { exact: false })).toBeInTheDocument();
    const state = JSON.parse(localStorage.getItem('drop-demo-v1'));
    expect(state.stock.headphones).toBe(10);
    expect(Object.values(state.orders)[0].order.total).toBe(29800);
    await waitFor(() => expect(JSON.parse(localStorage.getItem('drop-bag-v1'))).toEqual([]));
  });
  it('opens details and closes them without losing the collection', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(await screen.findByRole('button', { name: 'View Studio Wireless' }));
    expect(screen.getByRole('dialog', { name: 'Studio Wireless' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Close dialog' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(8);
  });
});
