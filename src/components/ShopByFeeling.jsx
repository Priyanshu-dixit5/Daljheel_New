import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight } from 'lucide-react';

function Tile({ category, className }) {
  if (!category) return null;
  return (
    <Link
      to={`/shop?category=${category.slug}`}
      className={`group relative overflow-hidden rounded-lg ${className}`}
    >
      <img
        src={category.image}
        alt={category.name}
        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-purple-dark/90 via-purple/30 to-transparent" />
      <ArrowUpRight className="absolute right-4 top-4 h-5 w-5 text-gold" />
      <div className="absolute bottom-0 left-0 p-4 text-cream sm:p-5">
        <p className="text-xs text-gold-light">{category.subtitle}</p>
        <h3 className="font-display text-xl sm:text-2xl">{category.name}</h3>
      </div>
    </Link>
  );
}

export default function ShopByFeeling({ categories }) {
  const [first, second, third, fourth] = categories;

  return (
    <section className="bg-[#faf6ee] py-10 lg:py-20">
      <div className="page-wrap">
        <div className="mb-7 flex items-end justify-between lg:mb-10">
          <div>
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[#a6553b]">Begin with a ritual</p>
            <h2 className="font-display text-2xl text-[#292d28] sm:text-3xl md:text-4xl">Shop by feeling</h2>
          </div>
          <Link to="/shop" className="link-arrow hidden sm:inline-flex">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Mobile: single-column stack | Desktop: complex grid */}
        <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:grid-rows-2">
          <Tile category={first} className="min-h-[220px] sm:min-h-[260px] lg:col-span-2 lg:row-span-2 lg:min-h-[480px]" />
          <Tile category={second} className="min-h-[180px] sm:min-h-[220px] lg:min-h-[230px]" />
          <Tile category={third} className="min-h-[180px] sm:min-h-[220px] lg:min-h-[230px]" />
          <Tile category={fourth} className="min-h-[180px] sm:min-h-[220px] sm:col-span-2 lg:col-span-2 lg:min-h-[230px]" />
        </div>

        {/* Mobile "view all" link */}
        <div className="mt-5 text-center sm:hidden">
          <Link to="/shop" className="link-arrow justify-center">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
