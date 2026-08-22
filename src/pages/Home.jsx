import { useEffect, useState } from 'react';
import { fetchCategories, fetchProducts } from '../api';
import Hero from '../components/Hero';
import CategoryQuickLinks from '../components/CategoryQuickLinks';
import StatsBar from '../components/StatsBar';
import ShopByFeeling from '../components/ShopByFeeling';
import TrendyProducts from '../components/TrendyProducts';
import BrandStory from '../components/BrandStory';
import SaffronHighlight from '../components/SaffronHighlight';
import SaffronLuxurySection from '../components/SaffronLuxurySection';
import TrustedByMarquee from '../components/TrustedByMarquee';
import VideoSection from '../components/VideoSection';
import InstagramCta from '../components/InstagramCta';
import SaffronCTA from '../components/SaffronCTA';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [cats, prods] = await Promise.all([
          fetchCategories(),
          fetchProducts(),
        ]);
        setCategories(cats);
        setProducts(prods);
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      {/* Hero with banner carousel */}
      <Hero />

      {/* Category quick links */}
      <CategoryQuickLinks categories={categories} />

      {/* Stats bar */}
      <StatsBar />

      {/* Shop by feeling – category grid */}
      <ShopByFeeling categories={categories} />

      {/* Trendy products grid */}
      <TrendyProducts products={products} />

      {/* Brand story */}
      <BrandStory />

      {/* Saffron highlight */}
      <SaffronHighlight />

      {/* Trusted by marquee */}
      <TrustedByMarquee />

      {/* Daljheel video */}
      <VideoSection />

      {/* Saffron luxury showcase */}
      <SaffronLuxurySection />

      {/* Instagram CTA */}
      <InstagramCta />

      {/* Saffron CTA banner */}
      <SaffronCTA />
    </>
  );
}
