import { ArrowUpRight, Cube, ArrowsClockwise, ShieldCheck } from '@phosphor-icons/react';
import { Wordmark } from './Navbar';
export default function Footer({ onAbout, onHelp }) {
  return (
    <>
      <section className="principles page-width" aria-label="Shopping information">
        <div>
          <Cube size={27} weight="light" />
          <p>
            <strong>A considered collection</strong>
            <span>Good design makes the cut.</span>
          </p>
        </div>
        <div>
          <ArrowsClockwise size={27} weight="light" />
          <p>
            <strong>A fresh perspective</strong>
            <span>Small drops. New discoveries.</span>
          </p>
        </div>
        <div>
          <ShieldCheck size={27} weight="light" />
          <p>
            <strong>No checkout surprises</strong>
            <span>Clear prices. Simulated payments.</span>
          </p>
        </div>
      </section>
      <section className="closing page-width">
        <h2>
          Less scrolling.
          <br />
          More <span>“that’s the one.”</span>
        </h2>
        <div>
          <p>
            We find the good stuff.
            <br />
            You make it part of your everyday.
          </p>
          <button className="text-link" onClick={onAbout}>
            A little about us <ArrowUpRight size={18} />
          </button>
        </div>
        <span className="closing-symbol" aria-hidden="true">
          <ArrowUpRight weight="light" />
        </span>
      </section>
      <footer className="footer page-width">
        <a href="#" aria-label="DROP home">
          <Wordmark />
        </a>
        <span>Good things. Right here.</span>
        <div>
          <button onClick={onHelp}>
            How the drop works <ArrowUpRight size={14} />
          </button>
          <span>© {new Date().getFullYear()} DROP</span>
        </div>
      </footer>
    </>
  );
}
