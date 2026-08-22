import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export default function CategoryQuickLinks({ categories }) {
  const items = categories.length ? [...categories, ...categories] : [];
  return <section className="overflow-hidden border-y border-[#e1d9cd] bg-[#fffdf8] py-8 lg:py-16"><div className="page-wrap"><div className="mb-5 lg:mb-8"><p className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-[#a6553b]">Start here</p><h2 className="font-display text-2xl text-[#292d28] sm:text-3xl md:text-4xl">What are you looking for?</h2></div></div><div className="category-marquee" aria-label="Product categories"><div className="category-marquee-track">{items.map((cat, index) => <Link key={`${cat.id}-${index}`} to={`/shop?category=${cat.slug}`} className="group flex w-[148px] shrink-0 items-center gap-3 border border-[#e1d9cd] bg-white p-3 transition hover:border-[#a6553b] hover:shadow-sm sm:w-[190px]"><img src={cat.image} alt={index < categories.length ? cat.name : ''} className="h-12 w-12 shrink-0 rounded-sm object-cover" /><span className="truncate text-sm font-medium text-ink">{cat.name}</span><ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-[#a6553b] opacity-0 transition group-hover:opacity-100" /></Link>)}</div></div></section>;
}
