import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { fetchBanners } from '../api';

const DEFAULT_SLIDES = [
  { id: 'slide-saffron', image: '/images/banner-saffron.png', alt: 'Pure Kashmiri Saffron from Daljheel', link: '/product/daljheel-saffron' },
  { id: 'slide-almonds', image: '/images/banner-almonds.png', alt: 'Premium Almonds from Daljheel Food Mart', link: '/shop' },
  { id: 'slide-walnuts', image: '/images/banner-walnuts.png', alt: 'Kashmiri Walnuts from Daljheel Food Mart', link: '/shop' },
  { id: 'slide-shilajit', image: '/images/banner-shilajit.png', alt: 'Himalayan Shilajit Resin from Daljheel', link: '/shop' },
];

function Carousel({ slides }) {
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(true);
  const indexRef = useRef(0);
  const goNext = useCallback(() => { setAnimating(true); setIndex((current) => { const next = current + 1; indexRef.current = next; return next; }); }, []);
  useEffect(() => { if (slides.length < 2) return undefined; const timer = window.setInterval(goNext, 4500); return () => window.clearInterval(timer); }, [slides.length, goNext]);
  const track = [...slides, slides[0]];
  return <div className="relative overflow-hidden"><div className={`flex ${animating ? 'transition-transform duration-700 ease-in-out' : ''}`} style={{ transform: `translateX(-${index * 100}%)` }} onTransitionEnd={() => { if (indexRef.current === slides.length) { setAnimating(false); setIndex(0); indexRef.current = 0; } }}>{track.map((slide, i) => <Link key={`${slide.id}-${i}`} to={slide.link || '/shop'} className="block w-full shrink-0"><img src={slide.image} alt={slide.alt || 'Daljheel banner'} className="h-[200px] w-full object-cover sm:h-[300px] lg:h-[420px]" /></Link>)}</div>{slides.length > 1 && <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">{slides.map((slide, i) => <button key={slide.id} type="button" aria-label={`Go to slide ${i + 1}`} onClick={() => { setAnimating(true); setIndex(i); indexRef.current = i; }} className={`h-2 rounded-full transition-all duration-300 ${i === index % slides.length ? 'w-6 bg-[#d59a2b]' : 'w-2 bg-white/60 hover:bg-white'}`} />)}</div>}</div>;
}

export default function Hero() {
  const content = useContent();
  const [banners, setBanners] = useState([]);
  useEffect(() => { fetchBanners().then((data) => { if (Array.isArray(data) && data.length >= 2) setBanners(data); }).catch(() => {}); }, []);
  const slides = banners.length ? banners : DEFAULT_SLIDES;
  return <section className="bg-[#faf6ee]"><Carousel slides={slides} /><div className="page-wrap grid items-center gap-6 py-7 sm:gap-8 lg:grid-cols-2 lg:gap-16 lg:py-14"><div className="order-1 lg:order-2"><div className="overflow-hidden rounded-sm border border-[#e3dbcf]"><img src="/images/saffron.png" alt="Daljheel Saffron" className="h-[200px] w-full object-cover sm:h-[320px] lg:h-[460px]" /></div></div><div className="order-2 space-y-4 sm:space-y-5 lg:order-1 lg:space-y-6"><p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#9b4b35]">From the valley, thoughtfully chosen</p><h1 className="font-display text-4xl leading-[0.95] text-[#282b28] sm:text-5xl lg:text-7xl">Good food has a <span className="italic text-[#a6553b]">place.</span></h1><p className="max-w-md text-sm leading-relaxed text-ink-muted sm:text-base">Premium saffron, dry fruits and wellness essentials from Daljheel Food Mart — rooted in Kashmir, packed for your home.</p><div className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap"><Link to="/shop" className="inline-flex items-center justify-center gap-2 bg-[#24513f] px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#1b4031] sm:px-5 sm:py-3 sm:text-[14px]">Shop the Collection <ArrowRight className="h-4 w-4" /></Link>{content?.whatsappDigits && <a href={`https://wa.me/${content.whatsappDigits}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-[#2f7b4d] px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#245f3c] sm:px-5 sm:py-3 sm:text-[14px]"><MessageCircle className="h-4 w-4" />Order on WhatsApp</a>}</div></div></div></section>;
}
