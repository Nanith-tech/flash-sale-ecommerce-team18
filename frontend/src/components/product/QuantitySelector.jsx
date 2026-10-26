import { Minus, Plus } from '@phosphor-icons/react';
export default function QuantitySelector({ name, quantity, max, onChange, disabled = false }) {
  return (
    <div className="quantity-selector">
      <button
        aria-label={`Decrease ${name} quantity`}
        disabled={disabled || quantity <= 1}
        onClick={() => onChange(quantity - 1)}
      >
        <Minus size={14} />
      </button>
      <output aria-label={`${name} quantity`}>{quantity}</output>
      <button
        aria-label={`Increase ${name} quantity`}
        disabled={disabled || quantity >= Math.min(max, 10)}
        onClick={() => onChange(quantity + 1)}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
