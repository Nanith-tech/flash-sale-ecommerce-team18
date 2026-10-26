import {
  ArrowRight,
  CheckCircle,
  Tote,
  Trash,
  LockSimple,
  ArrowUpRight,
} from '@phosphor-icons/react';
import Modal from '../common/Modal';
import QuantitySelector from '../product/QuantitySelector';
import { cartTotal, money } from '../../utils/format';
export default function CartDrawer({
  open,
  onClose,
  items,
  onQuantity,
  onRemove,
  onCheckout,
  pending,
  error,
  confirmation,
  unavailable,
}) {
  const total = cartTotal(items);
  const savings = items.reduce(
    (sum, i) => sum + (i.product.originalPrice - i.product.salePrice) * i.quantity,
    0,
  );
  const invalid = items.some((i) => i.quantity > i.product.stock);
  return (
    <Modal
      open={open}
      onClose={pending ? () => {} : onClose}
      title={
        confirmation ? 'All yours.' : `Your bag (${items.reduce((n, i) => n + i.quantity, 0)})`
      }
      className="cart-drawer"
    >
      {confirmation ? (
        <div className="order-confirmation">
          <CheckCircle size={66} weight="light" />
          <h3>A very good find.</h3>
          <p>Your simulated order is confirmed. No payment was taken.</p>
          <div className="order-receipt">
            <span>Order reference</span>
            <strong>{confirmation.reference}</strong>
            <span>Order total</span>
            <strong>{money(confirmation.total)}</strong>
          </div>
          <p>The demo stock in this browser has been updated.</p>
          <button className="button primary" onClick={onClose}>
            Back to the collection <ArrowUpRight size={18} />
          </button>
        </div>
      ) : !items.length ? (
        <div className="empty-bag">
          <Tote size={56} weight="light" />
          <h3>A little room for a good find.</h3>
          <p>Your bag is empty. Let’s change that.</p>
          <button className="button primary" onClick={onClose}>
            Explore the drop <ArrowRight size={18} />
          </button>
        </div>
      ) : (
        <>
          <p className="cart-intro">Good choices. Great prices.</p>
          <div className="cart-items">
            {items.map(({ product, quantity }) => (
              <div className="cart-item" key={product.id}>
                <img src={product.image} alt={product.name} width="92" height="105" />
                <div className="cart-item-copy">
                  <span>{product.brand}</span>
                  <h3>{product.name}</h3>
                  <p>{product.color}</p>
                  <QuantitySelector
                    name={product.name}
                    quantity={quantity}
                    max={product.stock}
                    disabled={pending}
                    onChange={(value) => onQuantity(product.id, value)}
                  />
                  {quantity > product.stock && (
                    <p className="cart-stock-error">
                      Only {product.stock} left. Reduce the quantity or remove this item.
                    </p>
                  )}
                </div>
                <div className="cart-item-end">
                  <strong>{money(product.salePrice * quantity)}</strong>
                  <button
                    className="icon-button"
                    disabled={pending}
                    aria-label={`Remove ${product.name} from bag`}
                    onClick={() => onRemove(product.id)}
                  >
                    <Trash size={19} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-bottom">
            <p className="savings-note">Good timing. You’re saving {money(savings)}.</p>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{money(total)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery</span>
              <span>Not applicable</span>
            </div>
            <div className="summary-row summary-total">
              <strong>Total</strong>
              <strong>{money(total)}</strong>
            </div>
            <p className="checkout-note">
              This is a simulated checkout. No payment or shipping details are needed. Your bag does
              not reserve stock.
            </p>
            {error && (
              <p className="inline-error" role="alert">
                {error}
              </p>
            )}
            {unavailable && (
              <p className="inline-error">The drop is not active. Checkout is unavailable.</p>
            )}
            <button
              className="button primary checkout-button"
              onClick={onCheckout}
              disabled={pending || invalid || unavailable}
            >
              {pending ? 'Confirming your order…' : 'Confirm simulated order'}
              {!pending && <ArrowRight size={19} />}
            </button>
            <span className="secure-note">
              <LockSimple size={14} /> Prices and availability confirmed at checkout
            </span>
          </div>
        </>
      )}
    </Modal>
  );
}
