import {
  ArrowDownRight,
  ArrowUpRight,
  MagnifyingGlass,
  Heart,
  Tote,
  List,
  X,
} from '@phosphor-icons/react';
import { useState } from 'react';
export function Wordmark() {
  return (
    <span className="wordmark">
      drop
      <span className="brand-symbol">
        <ArrowDownRight weight="bold" />
      </span>
    </span>
  );
}
export default function Navbar({
  count,
  onCart,
  onSearch,
  savedOnly,
  onSaved,
  onCategory,
  onAbout,
}) {
  const [menu, setMenu] = useState(false);
  const navigate = (category) => {
    onCategory(category);
    setMenu(false);
    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <>
      <div className="announcement">
        <span>A little less price. A lot more possibility.</span>
        <a href="#collection">
          Explore the weekend drop <ArrowUpRight size={14} />
        </a>
        <span className="demo-label">Demo store · No real purchases</span>
      </div>
      <header className="header page-width">
        <a
          href="#"
          className="brand-link"
          aria-label="DROP home"
          onClick={() => {
            onCategory('All finds');
            onSaved(false);
          }}
        >
          <Wordmark />
        </a>
        <nav aria-label="Main navigation" className={menu ? 'main-nav menu-open' : 'main-nav'}>
          <button className="nav-active" onClick={() => navigate('All finds')}>
            The drop <span className="live-dot" />
          </button>
          <button onClick={() => navigate('Audio')}>Audio & tech</button>
          <button onClick={() => navigate('Lifestyle')}>Everyday living</button>
          <button onClick={onAbout}>
            Our story <ArrowUpRight size={13} />
          </button>
        </nav>
        <div className="header-actions">
          <button className="icon-button" aria-label="Search products" onClick={onSearch}>
            <MagnifyingGlass size={22} />
          </button>
          <button
            className={`icon-button saved-button ${savedOnly ? 'selected' : ''}`}
            aria-label={savedOnly ? 'Show all products' : 'Show saved products'}
            aria-pressed={savedOnly}
            onClick={() => onSaved(!savedOnly)}
          >
            <Heart size={22} weight={savedOnly ? 'fill' : 'regular'} />
          </button>
          <button className="bag-button" aria-label={`Bag ${count}`} onClick={onCart}>
            <Tote size={22} />
            <span>Bag</span>
            <span className="bag-count">{count}</span>
          </button>
          <button
            className="icon-button mobile-menu-button"
            aria-label={menu ? 'Close menu' : 'Open menu'}
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X size={23} /> : <List size={23} />}
          </button>
        </div>
      </header>
    </>
  );
}
