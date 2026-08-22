import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchBanners } from '../api';

const DEFAULT_SLIDES = [
  { id: 'slide-saffron', image: '/images/banner-saffron.png', alt: 'Pure Kashmiri Saffron from Daljheel', link: '/product/kashmiri-saffron' },
  { id: 'slide-almonds', image: '/images/banner-almonds.png', alt: 'Premium Almonds from Daljheel Food Mart', link: '/shop' },
  { id: 'slide-walnuts', image: '/images/banner-walnuts.png', alt: 'Kashmiri Walnuts from Daljheel Food Mart', link: '/shop' },
  { id: 'slide-shilajit', image: '/images/banner-shilajit.png', alt: 'Himalayan Shilajit Resin from Daljheel', link: '/shop' },
];

export default function Hero() {
  const [banners, setBanners] = useState([]);
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(true);
  const indexRef = useRef(0);
  const slides = banners.length >= 2 ? banners : DEFAULT_SLIDES;
  const next = useCallback(() => { setAnimating(true); setIndex((current) => { const value = current + 1; indexRef.current = value; return value; }); }, []);

  useEffect(() => { fetchBanners().then((data) => { if (Array.isArray(data) && data.length >= 2) setBanners(data); }).catch(() => {}); }, []);
  useEffect(() => { const timer = window.setInterval(next, 4500); return () => window.clearInterval(timer); }, [next]);

  const track = [...slides, slides[0]];
  return <section className="bg-[#faf6ee]"><div className="relative overflow-hidden"><div className={`flex ${animating ? 'transition-transform duration-700 ease-in-out' : ''}`} style={{ transform: `translateX(-${index * 100}%)` }} onTransitionEnd={() => { if (indexRef.current === slides.length) { setAnimating(false); setIndex(0); indexRef.current = 0; } }}>{track.map((slide, i) => <Link key={`${slide.id}-${i}`} to={slide.link || '/shop'} className="block w-full shrink-0"><img src={slide.image} alt={slide.alt || 'Daljheel banner'} className="h-[200px] w-full object-cover sm:h-[300px] lg:h-[420px]" /></Link>)}</div><div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">{slides.map((slide, i) => <button key={slide.id} type="button" aria-label={`Go to slide ${i + 1}`} onClick={() => { setAnimating(true); setIndex(i); indexRef.current = i; }} className={`h-2 rounded-full transition-all ${i === index % slides.length ? 'w-6 bg-[#d59a2b]' : 'w-2 bg-white/60 hover:bg-white'}`} />)}</div></div></section>;
}
