import { Heart, Plus, Check, ArrowUpRight } from '@phosphor-icons/react';
import { money, discount } from '../../utils/format';
import StockIndicator from './StockIndicator';
export default function ProductCard({
  product,
  saved,
  onSave,
  onAdd,
  onDetails,
  inCart,
  unavailable,
}) {
  const soldOut = product.stock === 0;
  return (
    <article className={`product-card ${soldOut ? 'product-sold-out' : ''}`}>
      <div className={`product-image image-${product.id}`}>
        <button
          className="product-image-link"
          onClick={onDetails}
          aria-label={`View ${product.name}`}
        >
          <img
            src={product.image}
            alt={`${product.color} ${product.name}`}
            loading="lazy"
            width="900"
            height="900"
          />
        </button>
        <span className="discount-label">{soldOut ? 'Sold out' : `−${discount(product)}%`}</span>
        <button
          className={`save-product ${saved ? 'is-saved' : ''}`}
          aria-label={`${saved ? 'Unsave' : 'Save'} ${product.name}`}
          aria-pressed={saved}
          onClick={onSave}
        >
          <Heart size={20} weight={saved ? 'fill' : 'regular'} />
        </button>
      </div>
      <div className="product-meta">
        <span>{product.brand}</span>
        <span>{product.category}</span>
      </div>
      <button className="product-name" onClick={onDetails}>
        {product.name}
        <ArrowUpRight size={17} />
      </button>
      <p className="product-color">{product.color}</p>
      <div className="product-price">
        <strong>{money(product.salePrice)}</strong>
        <del>{money(product.originalPrice)}</del>
        <span>Save {money(product.originalPrice - product.salePrice)}</span>
      </div>
      <StockIndicator product={product} />
      <button
        className={`add-button ${inCart ? 'in-cart' : ''}`}
        onClick={onAdd}
        disabled={soldOut || unavailable || inCart >= Math.min(product.stock, 10)}
      >
        {soldOut
          ? 'Gone for now'
          : unavailable
            ? 'Drop unavailable'
            : inCart
              ? `In your bag (${inCart})`
              : 'Add to bag'}
        {inCart ? <Check size={17} /> : <Plus size={18} />}
      </button>
    </article>
  );
}
