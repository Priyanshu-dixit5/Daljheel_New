import { Leaf, Heart, Flower2, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  { icon: Leaf, label: '100% Pure Saffron' },
  { icon: Heart, label: 'Handpicked with Care' },
  { icon: Flower2, label: 'Rich Aroma & Flavor' },
  { icon: Shield, label: 'Premium Quality' },
];

const benefits = [
  'Boosts Immunity',
  'Improves Mood',
  'Enhances Skin Glow',
  'Rich in Antioxidants',
  'Aids Digestion',
];

const packageItems = [
  'Premium Glass Jar',
  'Airtight Seal',
  'Retains Freshness',
  'Hygienically Packed',
];

const whyChoose = [
  '100% Pure and Natural',
  'Rich Color, Aroma & Taste',
  'Carefully Sourced',
  'Trusted Quality',
];

export default function SaffronLuxurySection() {
  return (
    <section className="bg-purple-deep py-10 lg:py-24">
      <div className="page-wrap">
        <div className="mb-5 overflow-hidden rounded-lg gold-border">
          <img
            src="/saffron-luxury.png"
            alt="Daljheel Saffron — Pure Elegance. Rich in Every Thread."
            className="w-full object-cover"
          />
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="relative overflow-hidden rounded-lg gold-border bg-purple p-8 lg:col-span-2 lg:p-10">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold">
                <span className="font-display text-2xl text-gold">D</span>
              </div>
              <h2 className="font-display text-2xl tracking-[0.18em] text-gold lg:text-3xl">
                DALJHEEL SAFFRON
              </h2>
              <div className="my-4 flex items-center justify-center gap-4">
                <div className="h-px w-12 bg-gold/50" />
                <p className="text-sm italic text-gold-light">Pure Elegance. Rich in Every Thread.</p>
                <div className="h-px w-12 bg-gold/50" />
              </div>
              <img
                src="/images/saffron.png"
                alt="Daljheel Saffron"
                className="mx-auto my-8 h-48 w-48 rounded-lg object-cover shadow-2xl lg:h-56 lg:w-56"
              />
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {features.map(({ icon: Icon, label }) => (
                  <div key={label} className="text-center">
                    <Icon className="mx-auto mb-2 h-6 w-6 text-gold" />
                    <span className="text-[10px] uppercase tracking-wider text-gold-light">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-lg gold-border bg-cream p-6">
              <h3 className="mb-3 font-display text-sm uppercase tracking-wider text-ink">
                About Daljheel Saffron
              </h3>
              <p className="text-sm leading-relaxed text-ink-muted">
                Handpicked from the fields of Kashmir, Daljheel Saffron is The Golden Thread of Purity
                — 1gm of authentic threads from Pampore.
              </p>
            </div>

            <div className="rounded-lg bg-purple p-6 gold-border">
              <h3 className="mb-4 font-display text-sm uppercase tracking-wider text-gold">
                Benefits of Saffron
              </h3>
              <ul className="space-y-3">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-2 text-sm text-cream/85">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg gold-border bg-cream p-6">
              <h3 className="mb-3 font-display text-sm uppercase tracking-wider text-ink">
                In the Package
              </h3>
              <ul className="space-y-2">
                {packageItems.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-ink-muted">
                    <span className="text-gold">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg gold-border bg-cream p-6">
            <h3 className="mb-4 font-display text-sm uppercase tracking-wider text-ink">How to use</h3>
            <ol className="space-y-3 text-sm text-ink-muted">
              <li><span className="font-semibold text-gold">1. Soak</span> — A few threads in warm milk.</li>
              <li><span className="font-semibold text-gold">2. Stir</span> — Let the colour and aroma bloom.</li>
              <li><span className="font-semibold text-gold">3. Enjoy</span> — In food, drink or ritual.</li>
            </ol>
          </div>
          <div className="rounded-lg bg-purple p-6 gold-border">
            <h3 className="mb-3 font-display text-sm uppercase tracking-wider text-gold">Handpicked with love</h3>
            <p className="text-sm leading-relaxed text-cream/80">
              Each thread is selected with care so you receive saffron that honours Kashmiri heritage.
            </p>
          </div>
          <div className="rounded-lg gold-border bg-cream p-6">
            <h3 className="mb-4 font-display text-sm uppercase tracking-wider text-ink">Why choose Daljheel</h3>
            <div className="grid grid-cols-2 gap-3">
              {whyChoose.map((item) => (
                <p key={item} className="border border-gold/30 p-2 text-center text-[11px] text-ink-muted">
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col items-center justify-between gap-4 rounded-lg bg-purple px-6 py-8 text-center lg:flex-row lg:text-left">
          <p className="font-display text-lg tracking-wide text-gold lg:text-xl">
            A LITTLE SAFFRON, A LOT OF WELLNESS.
          </p>
          <Link to="/product/daljheel-saffron" className="link-arrow text-gold-light">
            Shop saffron <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
