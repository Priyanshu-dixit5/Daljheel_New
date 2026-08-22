import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function BannerSlider({ banners }) {
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(true);
  const indexRef = useRef(0);

  const goNext = useCallback(() => {
    if (!banners?.length) return;
    setAnimating(true);
    setIndex((prev) => {
      const next = prev + 1;
      indexRef.current = next;
      return next;
    });
  }, [banners]);

  const goPrev = useCallback(() => {
    if (!banners?.length) return;
    if (indexRef.current === 0) {
      setAnimating(false);
      setIndex(banners.length);
      indexRef.current = banners.length;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimating(true);
          setIndex(banners.length - 1);
          indexRef.current = banners.length - 1;
        });
      });
    } else {
      setAnimating(true);
      setIndex((prev) => {
        const next = prev - 1;
        indexRef.current = next;
        return next;
      });
    }
  }, [banners]);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    if (!banners?.length || banners.length < 2) return undefined;
    const timer = setInterval(goNext, 4500);
    return () => clearInterval(timer);
  }, [banners, goNext]);

  if (!banners?.length) return null;

  const track = [...banners, banners[0]];

  return (
    <section className="bg-purple-deep">
      <div className="relative mx-auto max-w-7xl overflow-hidden">
        <div
          className={`flex ${animating ? 'transition-transform duration-700 ease-in-out' : ''}`}
          style={{ transform: `translateX(-${index * 100}%)` }}
          onTransitionEnd={() => {
            if (indexRef.current === banners.length) {
              setAnimating(false);
              setIndex(0);
              indexRef.current = 0;
            }
          }}
        >
          {track.map((banner, i) => (
            <Link
              key={`${banner.id}-${i}`}
              to={banner.link}
              className="block w-full shrink-0"
            >
              <img
                src={banner.image}
                alt={banner.alt}
                className="h-[220px] w-full object-cover sm:h-[320px] lg:h-[420px]"
              />
            </Link>
          ))}
        </div>

        {banners.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous banner"
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-cream hover:bg-black/60"
              onClick={goPrev}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next banner"
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-cream hover:bg-black/60"
              onClick={goNext}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
              {banners.map((banner, i) => (
                <button
                  key={banner.id}
                  type="button"
                  aria-label={banner.title}
                  onClick={() => {
                    setAnimating(true);
                    setIndex(i);
                    indexRef.current = i;
                  }}
                  className={`h-2 w-2 rounded-full ${
                    i === index % banners.length ? 'bg-gold' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
