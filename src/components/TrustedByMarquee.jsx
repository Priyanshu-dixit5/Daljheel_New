const brands = [
  { id: 'walmart', type: 'walmart' },
  { id: 'big-bazaar', type: 'bigbazaar' },
  { id: 'taj-1', type: 'taj', subtitle: 'Hotels Resorts and Palaces' },
  { id: 'taj-2', type: 'taj', subtitle: 'GRT Hotels' },
  { id: 'oberoi', type: 'oberoi' },
];

function TajEmblem() {
  return (
    <svg viewBox="0 0 48 48" className="h-10 w-10 text-ink/40" fill="none" stroke="currentColor" strokeWidth="1.2">
      <circle cx="24" cy="24" r="22" />
      <path
        d="M24 10c-2.5 5-8 8-8 14s5.5 11 8 18c2.5-7 8-12 8-18s-5.5-9-8-14z"
        fill="currentColor"
        fillOpacity="0.15"
      />
      <path d="M24 10c-2.5 5-8 8-8 14s5.5 11 8 18c2.5-7 8-12 8-18s-5.5-9-8-14z" />
    </svg>
  );
}

function OberoiEmblem() {
  return (
    <svg viewBox="0 0 48 48" className="h-10 w-10 text-ink/40" fill="none" stroke="currentColor" strokeWidth="1.2">
      <circle cx="24" cy="24" r="22" />
      <path
        d="M24 12c-2 4-7 6-7 11s5 9 7 15c2-6 7-10 7-15s-5-7-7-11z"
        fill="currentColor"
        fillOpacity="0.12"
      />
      <path d="M24 12c-2 4-7 6-7 11s5 9 7 15c2-6 7-10 7-15s-5-7-7-11z" />
    </svg>
  );
}

function BrandLogo({ brand }) {
  if (brand.type === 'walmart') {
    return (
      <div className="flex shrink-0 items-center gap-2 px-10 md:px-14">
        <span className="whitespace-nowrap font-display text-[1.65rem] font-normal tracking-tight text-ink/45 md:text-[1.85rem]">
          Walmart
        </span>
        <svg viewBox="0 0 20 20" className="h-5 w-5 shrink-0 text-ink/45" fill="currentColor">
          <path d="M10 1.5l2.1 6.4H18.5l-5.3 3.9 2.1 6.4L10 14.3l-5.3 3.9 2.1-6.4L1.5 7.9h6.4z" />
        </svg>
      </div>
    );
  }

  if (brand.type === 'bigbazaar') {
    return (
      <div className="shrink-0 px-10 md:px-14">
        <span className="whitespace-nowrap font-display text-xl font-bold tracking-[0.12em] text-ink/45 md:text-2xl">
          BIG BAZAAR
        </span>
      </div>
    );
  }

  if (brand.type === 'taj') {
    return (
      <div className="flex shrink-0 flex-col items-center px-10 md:px-14">
        <TajEmblem />
        <span className="mt-1 font-display text-lg tracking-[0.28em] text-ink/45 md:text-xl">TAJ</span>
        <span className="mt-0.5 whitespace-nowrap text-[8px] uppercase tracking-[0.14em] text-ink/30 md:text-[9px]">
          {brand.subtitle}
        </span>
      </div>
    );
  }

  return (
    <div className="flex shrink-0 flex-col items-center px-10 md:px-14">
      <OberoiEmblem />
      <span className="mt-1 font-display text-lg italic text-ink/45 md:text-xl">Oberoi</span>
      <span className="mt-0.5 whitespace-nowrap text-[8px] uppercase tracking-[0.14em] text-ink/30 md:text-[9px]">
        Hotels &amp; Resorts
      </span>
    </div>
  );
}

export default function TrustedByMarquee() {
  const loop = [...brands, ...brands, ...brands];

  return (
    <section className="border-y border-gold/10 bg-cream py-10">
      <h2 className="mb-8 text-center font-display text-2xl font-semibold text-ink md:text-3xl">
        Trusted By
      </h2>
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-cream via-cream/80 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-cream via-cream/80 to-transparent" />
        <div className="trusted-marquee flex w-max items-center py-2">
          {loop.map((brand, i) => (
            <BrandLogo key={`${brand.id}-${i}`} brand={brand} />
          ))}
        </div>
      </div>
    </section>
  );
}
