import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function SaffronHighlight() {
  return (
    <section className="bg-cream-light py-12 lg:py-24">
      <div className="page-wrap grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
        <div className="space-y-6">
          <p className="section-label">The golden thread</p>
          <h2 className="font-display text-2xl leading-tight text-brand-red sm:text-3xl md:text-4xl lg:text-5xl">
            Daljheel Saffron: The Golden Thread of Purity.
          </h2>
          <p className="max-w-md text-base leading-relaxed text-ink-muted">
            1gm of Kashmiri saffron from Pampore — ₹299.
          </p>
          <Link
            to="/product/daljheel-saffron"
            className="link-arrow text-brand-red underline underline-offset-4"
          >
            Discover saffron <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex h-60 w-full items-center justify-center rounded-lg bg-gold/25 sm:h-72 lg:h-96">
          <img
            src="/images/saffron.png"
            alt="Daljheel saffron"
            className="h-56 w-56 rounded-full object-cover ring-4 ring-gold/40"
          />
        </div>
      </div>
    </section>
  );
}
