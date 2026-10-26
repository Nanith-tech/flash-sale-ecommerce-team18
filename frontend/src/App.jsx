import { useCallback, useRef, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  MagnifyingGlass,
  X,
  SlidersHorizontal,
  Heart,
} from '@phosphor-icons/react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import FlashSaleHero from './components/flash-sale/FlashSaleHero';
import CountdownTimer from './components/flash-sale/CountdownTimer';
import ProductCard from './components/product/ProductCard';
import ProductDetails from './components/product/ProductDetails';
import CartDrawer from './components/cart/CartDrawer';
import Modal from './components/common/Modal';
import { useCatalog } from './hooks/useCatalog';
import { usePersistentState } from './hooks/usePersistentState';
import { placeOrder } from './services/api';

const categories = ['All finds', 'Audio', 'Wearables', 'Workspace', 'Lifestyle'];
const validCart = (value) =>
  Array.isArray(value) &&
  value.every(
    (i) =>
      typeof i.productId === 'string' &&
      Number.isInteger(i.quantity) &&
      i.quantity > 0 &&
      i.quantity <= 10,
  ) &&
  new Set(value.map((i) => i.productId)).size === value.length;
export default function App() {
  const { catalog, loading, error, refresh } = useCatalog();
  const [cart, setCart] = usePersistentState('drop-bag-v1', [], validCart);
  const [saved, setSaved] = usePersistentState(
    'drop-saved-v1',
    [],
    (v) => Array.isArray(v) && v.every((i) => typeof i === 'string'),
  );
  const [category, setCategory] = useState('All finds');
  const [sort, setSort] = useState('curated');
  const [query, setQuery] = useState('');
  const [savedOnly, setSavedOnly] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [detailsId, setDetailsId] = useState(null);
  const [info, setInfo] = useState(null);
  const [pending, setPending] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const [timeUnavailable, setTimeUnavailable] = useState(false);
  const [toast, setToast] = useState('');
  const checkoutKey = useRef(null);
  const checkoutInFlight = useRef(false);
  const searchRef = useRef(null);
  const products = catalog?.products || [];
  const unavailable = !catalog || catalog.sale.status !== 'ACTIVE' || timeUnavailable;
  const items = cart
    .map((i) => ({ ...i, product: products.find((p) => p.id === i.productId) }))
    .filter((i) => i.product);
  const missingItems = cart.length > items.length;
  const count = cart.reduce((sum, i) => sum + i.quantity, 0);
  const details = products.find((p) => p.id === detailsId);
  const updateBag = useCallback(
    (updater) => {
      checkoutKey.current = null;
      setCheckoutError('');
      setConfirmation(null);
      setCart(updater);
    },
    [setCart],
  );
  function addProduct(product, quantity = 1) {
    if (pending || unavailable || product.stock === 0) return;
    updateBag((current) => {
      const entry = current.find((i) => i.productId === product.id);
      const nextQuantity = Math.min((entry?.quantity || 0) + quantity, product.stock, 10);
      return entry
        ? current.map((i) => (i.productId === product.id ? { ...i, quantity: nextQuantity } : i))
        : [...current, { productId: product.id, quantity: nextQuantity }];
    });
    setToast(`${product.name} is in your bag.`);
  }
  function toggleSaved(id) {
    setSaved((current) =>
      current.includes(id) ? current.filter((i) => i !== id) : [...current, id],
    );
  }
  function chooseCategory(value) {
    setCategory(value);
    setSavedOnly(false);
  }
  function showSaved(value) {
    setSavedOnly(value);
    if (value) {
      setCategory('All finds');
      setQuery('');
      document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
    }
  }
  async function checkout() {
    if (checkoutInFlight.current || !items.length || unavailable) return;
    if (missingItems) {
      setCheckoutError(
        'Some items are no longer in this drop. Remove unavailable items before continuing.',
      );
      return;
    }
    checkoutInFlight.current = true;
    setPending(true);
    setCheckoutError('');
    checkoutKey.current ||= crypto.randomUUID();
    try {
      const { order } = await placeOrder(cart, checkoutKey.current);
      setConfirmation(order);
      setCart([]);
      checkoutKey.current = null;
      setToast('Your simulated order is confirmed.');
      await refresh();
    } catch (err) {
      setCheckoutError(err.message);
      await refresh();
    } finally {
      checkoutInFlight.current = false;
      setPending(false);
    }
  }
  let filtered = products.filter(
    (p) =>
      (category === 'All finds' || p.category === category) &&
      (!savedOnly || saved.includes(p.id)) &&
      `${p.name} ${p.description} ${p.brand} ${p.category}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  if (sort === 'price-low') filtered = [...filtered].sort((a, b) => a.salePrice - b.salePrice);
  if (sort === 'price-high') filtered = [...filtered].sort((a, b) => b.salePrice - a.salePrice);
  if (sort === 'discount')
    filtered = [...filtered].sort(
      (a, b) => 1 - b.salePrice / b.originalPrice - (1 - a.salePrice / a.originalPrice),
    );
  const clearFilters = () => {
    setQuery('');
    setCategory('All finds');
    setSavedOnly(false);
  };
  return (
    <>
      <a href="#collection" className="skip-link">
        Skip to collection
      </a>
      <Navbar
        count={count}
        onCart={() => {
          setConfirmation(null);
          setCartOpen(true);
        }}
        onSearch={() => {
          document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
          searchRef.current?.focus({ preventScroll: true });
        }}
        savedOnly={savedOnly}
        onSaved={showSaved}
        onCategory={chooseCategory}
        onAbout={() => setInfo('story')}
      />
      <main>
        <div className="page-width">
          <FlashSaleHero
            onProduct={() => (products.length ? setDetailsId('headphones') : setInfo('help'))}
          />
          {catalog ? (
            <CountdownTimer catalog={catalog} onExpired={setTimeUnavailable} />
          ) : (
            <div className="countdown-placeholder">
              {loading
                ? 'Getting the latest drop…'
                : 'Live sale information is currently unavailable.'}
            </div>
          )}
        </div>
        <section
          id="collection"
          className="collection page-width"
          aria-labelledby="collection-heading"
        >
          <div className="collection-header">
            <div>
              <h2 id="collection-heading">
                {savedOnly ? 'Your good finds' : 'The current drop'}
                <span className="collection-heading-dot">.</span>
              </h2>
              <p>
                {savedOnly
                  ? 'A little collection of the things you love.'
                  : 'A few good things. A short window. Make it yours.'}
              </p>
            </div>
            <span className="collection-index">
              {catalog
                ? `${products.length} considered essentials`
                : 'A collection worth discovering'}{' '}
              <ArrowDownRightIcon />
            </span>
          </div>
          <div className="collection-toolbar">
            <div className="category-tabs" role="group" aria-label="Filter products by category">
              {categories.map((c) => (
                <button
                  key={c}
                  className={category === c ? 'active' : ''}
                  aria-pressed={category === c}
                  onClick={() => chooseCategory(c)}
                >
                  {c}
                  {c === 'All finds' && <span>{products.length}</span>}
                </button>
              ))}
            </div>
            <label className="sort-control">
              <SlidersHorizontal size={16} />
              <span className="sr-only">Sort products</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="curated">Our picks</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
                <option value="discount">Biggest saving</option>
              </select>
            </label>
          </div>
          <div className="search-row">
            <label className="collection-search">
              <MagnifyingGlass size={17} />
              <span className="sr-only">Search the collection</span>
              <input
                ref={searchRef}
                placeholder="Find something good…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button
                  className="icon-button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}
            </label>
            <span>
              {savedOnly && <Heart size={13} weight="fill" />}{' '}
              {loading
                ? 'Loading finds'
                : `${filtered.length} ${filtered.length === 1 ? 'find' : 'finds'}`}
            </span>
          </div>
          {error && (
            <div className={catalog ? 'refresh-warning' : 'error-state'} role="alert">
              <h3>{catalog ? 'Live stock could not refresh.' : 'The drop is taking a moment.'}</h3>
              <p>{error}</p>
              <button className="text-link" onClick={refresh}>
                Try again <ArrowRight size={16} />
              </button>
            </div>
          )}
          {loading && !catalog ? (
            <div className="product-grid" aria-label="Loading products" aria-busy="true">
              {Array.from({ length: 4 }, (_, i) => (
                <div className="product-skeleton" key={i}>
                  <div />
                  <span />
                  <span />
                </div>
              ))}
            </div>
          ) : !error || catalog ? (
            filtered.length ? (
              <div className="product-grid">
                {filtered.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    saved={saved.includes(product.id)}
                    onSave={() => toggleSaved(product.id)}
                    onAdd={() => addProduct(product)}
                    onDetails={() => setDetailsId(product.id)}
                    inCart={cart.find((i) => i.productId === product.id)?.quantity || 0}
                    unavailable={unavailable}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-results">
                <MagnifyingGlass size={35} weight="light" />
                <h3>{savedOnly ? 'Your favorites start here.' : 'No finds this time.'}</h3>
                <p>
                  {savedOnly
                    ? 'Tap a heart on any product to save it for later.'
                    : 'Try another search or explore the full collection.'}
                </p>
                <button className="button secondary" onClick={clearFilters}>
                  Explore all finds <ArrowRight size={17} />
                </button>
              </div>
            )
          ) : null}
          <p className="collection-end">
            Small collection. Big on good design.<span>That’s the whole drop.</span>
          </p>
        </section>
      </main>
      <Footer onAbout={() => setInfo('story')} onHelp={() => setInfo('help')} />
      <CartDrawer
        open={cartOpen}
        onClose={() => {
          setCartOpen(false);
          setConfirmation(null);
        }}
        items={items}
        onQuantity={(id, quantity) =>
          updateBag((current) => current.map((i) => (i.productId === id ? { ...i, quantity } : i)))
        }
        onRemove={(id) => updateBag((current) => current.filter((i) => i.productId !== id))}
        onCheckout={checkout}
        pending={pending}
        error={checkoutError}
        confirmation={confirmation}
        unavailable={unavailable}
      />
      {details && (
        <ProductDetails
          key={details.id}
          product={details}
          onClose={() => setDetailsId(null)}
          onAdd={(quantity) => addProduct(details, quantity)}
          inCart={cart.find((i) => i.productId === details.id)?.quantity || 0}
          unavailable={unavailable}
        />
      )}
      <Modal
        open={!!info}
        onClose={() => setInfo(null)}
        title={info === 'story' ? 'Good things, considered.' : 'How the drop works'}
        className="info-dialog"
      >
        <div className="info-copy">
          {info === 'story' ? (
            <>
              <h3>Less, but a little better.</h3>
              <p>
                DROP is a small collection of thoughtfully designed essentials, brought together for
                a limited time. Audio for your commute. Objects for your desk. Little things for
                your everyday.
              </p>
              <p>
                This is an educational shop with an illustrative catalog. Every checkout is
                simulated and no real payment is collected.
              </p>
            </>
          ) : (
            <>
              <h3>Find it. Bag it. Make it yours.</h3>
              <ol>
                <li>Explore the collection and check the live stock.</li>
                <li>Add your favorites to your bag. Adding doesn’t reserve stock.</li>
                <li>Review quantities and confirm your simulated order.</li>
                <li>Wait for your order reference. Only confirmed orders secure stock.</li>
              </ol>
              <p>
                The countdown uses the shop’s time. Once the drop ends, checkout closes. Product
                prices are in US dollars; this demo does not collect tax, shipping or payment
                information.
              </p>
            </>
          )}
          <button
            className="button primary"
            onClick={() => {
              setInfo(null);
              document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Explore the drop <ArrowUpRight size={18} />
          </button>
        </div>
      </Modal>
      <div className={`toast ${toast ? 'visible' : ''}`} role="status">
        {toast}
        <button
          className="text-link"
          onClick={() => {
            setCartOpen(true);
            setToast('');
          }}
        >
          View bag <ArrowRight size={15} />
        </button>
        <button
          className="icon-button"
          aria-label="Dismiss notification"
          onClick={() => setToast('')}
        >
          <X size={17} />
        </button>
      </div>
    </>
  );
}
function ArrowDownRightIcon() {
  return <ArrowUpRight size={18} />;
}
