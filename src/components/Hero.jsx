import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { fetchBanners } from '../api';

/* ── Default local banner slides (shown when API returns no banners) ── */
const DEFAULT_SLIDES = [
  {
    id: 'slide-saffron',
    image: '/images/banner-saffron.png',
    alt: 'Pure Kashmiri Saffron from Daljheel',
    title: 'Pure Kashmiri Saffron',
    subtitle: 'From the valley, thoughtfully chosen',
    link: '/product/daljheel-saffron',
  },
  {
    id: 'slide-almonds',
    image: '/images/banner-almonds.png',
    alt: 'Premium Almonds from Daljheel Food Mart',
    title: 'Premium Almonds',
    subtitle: 'Handpicked for your pantry',
    link: '/shop',
  },
  {
    id: 'slide-walnuts',
    image: '/images/banner-walnuts.png',
    alt: 'Kashmiri Walnuts from Daljheel Food Mart',
    title: 'Kashmiri Walnuts',
    subtitle: 'Rich in goodness, crafted with care',
    link: '/shop',
  },
  {
    id: 'slide-shilajit',
    image: '/images/banner-shilajit.png',
    alt: 'Himalayan Shilajit Resin from Daljheel',
    title: 'Shilajit Resin',
    subtitle: 'Wellness from the Himalayas',
    link: '/shop',
  },
];

/* ──────────────────────────────────────────────────────────────────── */

function Carousel({ slides }) {
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(true);
  const indexRef = useRef(0);

  const goNext = useCallback(() => {
    if (!slides?.length) return;
    setAnimating(true);
    setIndex((prev) => {
      const next = prev + 1;
      indexRef.current = next;
      return next;
    });
  }, [slides]);

  const goPrev = useCallback(() => {
    if (!slides?.length) return;
    if (indexRef.current === 0) {
      setAnimating(false);
      setIndex(slides.length);
      indexRef.current = slides.length;
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          setAnimating(true);
          setIndex(slides.length - 1);
          indexRef.current = slides.length - 1;
        })
      );
    } else {
      setAnimating(true);
      setIndex((prev) => {
        const next = prev - 1;
        indexRef.current = next;
        return next;
      });
    }
  }, [slides]);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    if (!slides?.length || slides.length < 2) return;
    const timer = setInterval(goNext, 4500);
    return () => clearInterval(timer);
  }, [slides, goNext]);

  if (!slides?.length) return null;

  const track = [...slides, slides[0]];
  const real = index % slides.length;

  return (
    <div className="relative overflow-hidden">
      {/* Track */}
      <div
        className={`flex ${animating ? 'transition-transform duration-700 ease-in-out' : ''}`}
        style={{ transform: `translateX(-${index * 100}%)` }}
        onTransitionEnd={() => {
          if (indexRef.current === slides.length) {
            setAnimating(false);
            setIndex(0);
            indexRef.current = 0;
          }
        }}
      >
        {track.map((slide, i) => (
          <Link
            key={`${slide.id}-${i}`}
            to={slide.link || '/shop'}
            className="relative block w-full shrink-0"
          >
            <img
              src={slide.image}
              alt={slide.title || slide.alt || 'Daljheel banner'}
              className="h-[200px] w-full object-cover sm:h-[300px] lg:h-[420px]"
            />
            {/* Overlay text */}
            {slide.title && (
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent flex items-end p-5 sm:p-8 lg:p-12">
                <div>
                  {slide.subtitle && (
                    <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#d59a2b] sm:text-[11px]">
                      {slide.subtitle}
                    </p>
                  )}
                  <h2 className="font-display text-xl leading-tight text-white sm:text-3xl lg:text-4xl">
                    {slide.title}
                  </h2>
                </div>
              </div>
            )}
          </Link>
        ))}
      </div>

      {/* Prev / Next arrows */}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={goPrev}
            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm hover:bg-black/60 transition"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={goNext}
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm hover:bg-black/60 transition"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => {
                  setAnimating(true);
                  setIndex(i);
                  indexRef.current = i;
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === real
                    ? 'w-6 bg-[#d59a2b]'
                    : 'w-2 bg-white/60 hover:bg-white'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────── */

export default function Hero() {
  const content = useContent();
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    fetchBanners()
      .then((data) => {
        // If the API returns banners, merge with defaults to get a full carousel
        if (Array.isArray(data) && data.length > 0) {
          // Use API banners if they have ≥2, otherwise use our rich local defaults
          setBanners(data.length >= 2 ? data : DEFAULT_SLIDES);
        }
      })
      .catch(() => {/* use defaults */});
  }, []);

  const slides = banners.length > 0 ? banners : DEFAULT_SLIDES;

  return (
    <section className="bg-[#faf6ee]">
      {/* ── Banner Carousel ── */}
      <Carousel slides={slides} />

      {/* ── Hero Text Block ── */}
      <div className="page-wrap grid items-center gap-6 py-7 sm:gap-8 lg:grid-cols-2 lg:gap-16 lg:py-14">
        {/* Image — appears FIRST on mobile, second on desktop */}
        <div className="relative order-1 lg:order-2">
          <div className="overflow-hidden rounded-sm border border-[#e3dbcf]">
            <img
              src="/images/saffron.png"
              alt="Daljheel Saffron — Pure Kashmiri Saffron in a glass jar with a gold lid"
              className="h-[200px] w-full object-cover sm:h-[320px] lg:h-[460px]"
            />
          </div>
          <div className="absolute -bottom-4 left-3 flex h-20 w-20 items-center justify-center rounded-full bg-[#d18b13] text-center shadow-lg sm:-left-4 sm:h-28 sm:w-28 sm:-bottom-5">
            <span className="px-2 font-display text-base leading-[0.9] text-white sm:px-3 sm:text-lg">
              50+<small className="block text-[10px] sm:text-[11px]">years of<br />legacy</small>
            </span>
          </div>
        </div>

        {/* Text — appears SECOND on mobile, first on desktop */}
        <div className="order-2 mt-4 space-y-4 sm:mt-0 sm:space-y-5 lg:order-1 lg:space-y-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#9b4b35]">From the valley, thoughtfully chosen</p>
          <h1 className="font-display text-4xl leading-[0.95] text-[#282b28] sm:text-5xl lg:text-7xl">
            Good food has a{' '}
            <span className="italic text-[#a6553b]">place.</span>
          </h1>
          <p className="max-w-md text-sm leading-relaxed text-ink-muted sm:text-base">
            Premium saffron, dry fruits and wellness essentials from Daljheel Food Mart — rooted in Kashmir, packed for your home.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link to="/shop" className="inline-flex items-center justify-center gap-2 bg-[#24513f] px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#1b4031] sm:px-5 sm:py-3 sm:text-[14px]">
              Shop the collection
              <ArrowRight className="h-4 w-4" />
            </Link>
            {content?.whatsappDigits && (
              <a
                href={`https://wa.me/${content.whatsappDigits}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#2f7b4d] px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#245f3c] sm:px-5 sm:py-3 sm:text-[14px]"
              >
                <MessageCircle className="h-4 w-4" />
                Order on WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
