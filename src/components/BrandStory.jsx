import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useContent } from '../context/ContentContext';

export default function BrandStory() {
  const content = useContent();

  return (
    <section className="bg-purple py-12 lg:py-24">
      <div className="page-wrap grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
        <div className="space-y-6">
          <p className="section-label text-gold-light">The Daljheel difference</p>
          <h2 className="font-display text-2xl leading-tight text-cream sm:text-3xl md:text-4xl lg:text-5xl">
            Pure, authentic,{' '}
            <span className="italic text-gold">from Kashmir.</span>
          </h2>
          <p className="max-w-md text-base leading-relaxed text-cream/80">
            {content?.about ||
              'Daljheel Food Mart is committed to providing authentic, high-quality wellness products sourced directly from nature.'}
          </p>
          <Link to="/about" className="btn-gold">
            Our story
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex justify-center">
          <div className="h-56 w-56 overflow-hidden rounded-full border-4 border-gold/40 sm:h-64 sm:w-64 lg:h-80 lg:w-80">
            <img
              src="/images/saffron.png"
              alt="Kashmiri saffron threads"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
