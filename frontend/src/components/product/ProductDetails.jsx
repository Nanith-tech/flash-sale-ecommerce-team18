import { useState } from 'react';
import { ArrowUpRight, Check } from '@phosphor-icons/react';
import Modal from '../common/Modal';
import QuantitySelector from './QuantitySelector';
import StockIndicator from './StockIndicator';
import { money, discount } from '../../utils/format';
export default function ProductDetails({ product, onClose, onAdd, unavailable, inCart }) {
  const [quantity, setQuantity] = useState(1);
  const remaining = Math.max(0, Math.min(10, product.stock) - inCart);
  const validQuantity = Math.min(quantity, Math.max(1, remaining));
  const [added, setAdded] = useState(false);
  return (
    <Modal open onClose={onClose} title={product.name} className="product-dialog">
      <div className="product-detail-layout">
        <div className={`detail-photo image-${product.id}`}>
          <img
            src={product.image}
            alt={`${product.color} ${product.name}`}
            width="900"
            height="900"
          />
        </div>
        <div className="detail-copy">
          <p className="detail-brand">
            {product.brand} / {product.category}
          </p>
          <h3>Made for your everyday.</h3>
          <p>{product.description}</p>
          <p className="detail-color">
            Color: <strong>{product.color}</strong>
          </p>
          <div className="detail-price">
            <strong>{money(product.salePrice)}</strong>
            <del>{money(product.originalPrice)}</del>
            <span>Save {discount(product)}%</span>
          </div>
          <StockIndicator product={product} />
          <QuantitySelector
            name={product.name}
            quantity={validQuantity}
            max={remaining}
            disabled={!remaining || unavailable}
            onChange={(value) => {
              setQuantity(value);
              setAdded(false);
            }}
          />
          <button
            className="button primary"
            disabled={!remaining || unavailable}
            onClick={() => {
              onAdd(validQuantity);
              setAdded(true);
            }}
          >
            {!product.stock
              ? 'Sold out'
              : unavailable
                ? 'Drop unavailable'
                : !remaining
                  ? 'Maximum quantity in bag'
                  : added
                    ? 'Added to your bag'
                    : 'Add to bag'}
            {added ? <Check size={19} /> : <ArrowUpRight size={19} />}
          </button>
          <small>Items are only secured when checkout is confirmed.</small>
        </div>
      </div>
    </Modal>
  );
}
