import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchCategories, fetchProducts } from '../api';
import { ProductCard } from '../components/TrendyProducts';

export default function Shop() {
  const [params] = useSearchParams();
  const category = params.get('category') || '';
  const search = params.get('search') || '';
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchCategories(), fetchProducts({ category, search })])
      .then(([cats, prods]) => {
        setCategories(cats);
        setProducts(prods);
      })
      .finally(() => setLoading(false));
  }, [category, search]);

  return (
    <section className="bg-cream-light py-8 lg:py-16">
      <div className="page-wrap">
        <p className="section-label mb-2">Shop</p>
        <h1 className="section-heading mb-6">The collection</h1>

        {/* Filter chips — horizontal scroll on mobile */}
        <div className="scroll-rail mb-6 lg:mb-8">
          <FilterChip to="/shop" active={!category}>All</FilterChip>
          {categories.map((cat) => (
            <FilterChip
              key={cat.slug}
              to={`/shop?category=${cat.slug}`}
              active={category === cat.slug}
            >
              {cat.name}
            </FilterChip>
          ))}
        </div>

        {search && (
          <p className="mb-5 text-sm text-ink-muted">
            Showing results for &ldquo;{search}&rdquo;
          </p>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple border-t-transparent" />
          </div>
        ) : products.length === 0 ? (
          <p className="text-ink-muted">No products found.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function FilterChip({ to, active, children }) {
  return (
    <Link
      to={to}
      className={`shrink-0 rounded-full px-4 py-1.5 text-sm whitespace-nowrap transition ${
        active ? 'bg-purple text-cream' : 'border border-gold/30 bg-white text-ink hover:border-gold'
      }`}
    >
      {children}
    </Link>
  );
}
