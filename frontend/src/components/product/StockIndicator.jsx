export default function StockIndicator({ product }) {
  const soldOut = product.stock === 0;
  return (
    <div className={`stock ${soldOut ? 'sold-out' : ''}`}>
      <div className="stock-label">
        <span>
          {soldOut ? 'All snapped up' : product.stock <= 8 ? 'Almost gone' : 'Going fast'}
        </span>
        <span>
          {soldOut ? (
            'Sold out'
          ) : (
            <>
              <strong>{product.stock}</strong> left
            </>
          )}
        </span>
      </div>
      <div
        className="stock-track"
        role="meter"
        aria-label={`${product.name} stock remaining`}
        aria-valuenow={product.stock}
        aria-valuemin={0}
        aria-valuemax={product.initialStock}
      >
        <span
          style={{
            width: `${Math.min(100, (product.stock / Math.max(1, product.initialStock)) * 100)}%`,
          }}
        />
      </div>
    </div>
  );
}
