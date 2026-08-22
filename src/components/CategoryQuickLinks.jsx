import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export default function CategoryQuickLinks({ categories }) {
  return (
    <section className="border-y border-[#e1d9cd] bg-[#fffdf8] py-8 lg:py-16">
      <div className="page-wrap">
        {/* Heading */}
        <div className="mb-5 lg:mb-8">
          <p className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-[#a6553b]">Start here</p>
          <h2 className="font-display text-2xl text-[#292d28] sm:text-3xl md:text-4xl">What are you looking for?</h2>
        </div>

        {/* Mobile: horizontal scroll rail | Desktop: 2-col grid layout */}
        <div className="scroll-rail lg:hidden">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.slug}`}
              className="group flex shrink-0 flex-col items-center gap-2 rounded-sm border border-[#e1d9cd] bg-white p-3 transition hover:border-[#a6553b] hover:shadow-sm"
              style={{ width: '100px' }}
            >
              <img src={cat.image} alt={cat.name} className="h-14 w-14 shrink-0 rounded-sm object-cover" />
              <span className="text-center text-[11px] font-medium leading-tight text-ink">{cat.name}</span>
            </Link>
          ))}
        </div>

        {/* Desktop: 2-col layout */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-16">
          <div />
          <div className="grid grid-cols-4 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.slug}`}
                className="group flex items-center gap-3 border border-[#e1d9cd] bg-white p-3 transition hover:border-[#a6553b] hover:shadow-sm"
              >
                <img src={cat.image} alt="" className="h-12 w-12 shrink-0 rounded-sm object-cover" />
                <span className="truncate text-sm font-medium text-ink">{cat.name}</span>
                <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-[#a6553b] opacity-0 transition group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
