import { Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext';

export default function About() {
  const content = useContent();

  return (
    <section className="bg-cream-light py-12 lg:py-20">
      <div className="page-wrap max-w-3xl">
        <img src="/images/logo.png" alt="Daljheel Food Mart" className="mb-6 h-20 w-20 rounded-full bg-black object-cover" />
        <p className="section-label mb-3">Our story</p>
        <h1 className="section-heading mb-6">{content?.businessName}</h1>
        <p className="mb-6 text-xl italic text-gold">{content?.tagline}</p>
        <p className="text-base leading-relaxed text-ink-muted">{content?.about}</p>

        {content?.philosophy && (
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {content.philosophy.map((item) => (
              <li key={item} className="border border-gold/30 bg-white px-4 py-3 text-sm text-ink">
                {item}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10 flex flex-wrap gap-4">
          <Link to="/shop" className="btn-primary">Shop the collection</Link>
          <Link to="/contact" className="btn-outline">Contact us</Link>
        </div>
      </div>
    </section>
  );
}
