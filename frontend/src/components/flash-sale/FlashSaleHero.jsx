import { ArrowUpRight } from '@phosphor-icons/react';
export default function FlashSaleHero({ onProduct }) {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="hero-copy">
        <h1 id="hero-heading">
          Good design.
          <br />
          Great timing<span>.</span>
        </h1>
        <p>
          Considered essentials. Unexpected prices.
          <br />
          Your next favorite, for a little less.
        </p>
        <a className="button primary hero-cta" href="#collection">
          Find your next favorite <ArrowUpRight size={19} />
        </a>
      </div>
      <div className="hero-art">
        <img
          src="/images/headphones.jpg"
          alt="Graphite over-ear wireless headphones with softly cushioned ear cups"
          width="900"
          height="900"
          fetchPriority="high"
        />
        <button className="hero-product" onClick={onProduct}>
          <span>
            <small>Meet your new everyday</small>
            <strong>
              Studio Wireless <span>$149</span>
            </strong>
          </span>
          <span className="hero-product-arrow">
            <ArrowUpRight size={24} />
          </span>
        </button>
      </div>
    </section>
  );
}
