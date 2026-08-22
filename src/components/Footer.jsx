import { Link } from 'react-router-dom';
import { ArrowRight, Instagram } from 'lucide-react';
import { useContent } from '../context/ContentContext';

export default function Footer() {
  const content = useContent();
  if (!content) return null;

  return (
    <footer className="border-t border-gold/20 bg-cream py-10 pb-20 lg:py-16 lg:pb-16">
      <div className="page-wrap grid gap-8 sm:grid-cols-2 md:grid-cols-4">
        <div className="sm:col-span-2 md:col-span-1">
          <img src="/images/logo.png" alt="" className="mb-3 h-12 w-12 rounded-full bg-black object-cover sm:h-14 sm:w-14" />
          <h3 className="font-display text-lg text-ink sm:text-xl">{content.businessName}</h3>
          <p className="mt-2 text-sm italic text-gold">{content.tagline}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-muted">
            Authentic Kashmiri saffron, Himalayan Shilajit, dry fruits and saffron-based skincare.
          </p>
        </div>

        <div>
          <h4 className="section-label mb-4">Shop</h4>
          <div className="flex flex-col gap-2 text-sm text-ink-muted">
            <Link to="/shop" className="hover:text-gold">All products</Link>
            <Link to="/shop?category=saffron" className="hover:text-gold">Saffron</Link>
            <Link to="/shop?category=shilajit" className="hover:text-gold">Shilajit</Link>
            <Link to="/shop?category=dry-fruits" className="hover:text-gold">Dry Fruits</Link>
            <Link to="/shop?category=skincare" className="hover:text-gold">Skincare</Link>
          </div>
        </div>

        <div>
          <h4 className="section-label mb-4">Find us</h4>
          <address className="not-italic text-sm leading-relaxed text-ink-muted">
            {content.address.line2}
            <br />
            {content.address.line3}
            <br />
            <a href={`mailto:${content.email}`} className="mt-2 inline-block hover:text-gold">
              {content.email}
            </a>
            <br />
            <a href={`tel:${content.phone.replace(/\s/g, '')}`} className="hover:text-gold">
              {content.phone}
            </a>
          </address>
        </div>

        <div>
          <h4 className="section-label mb-4">Stay connected</h4>
          <div className="flex flex-col gap-3 text-sm">
            <a
              href={`https://wa.me/${content.whatsappDigits}`}
              target="_blank"
              rel="noopener noreferrer"
              className="link-arrow text-ink"
            >
              WhatsApp us <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href={content.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-ink-muted hover:text-gold"
            >
              <Instagram className="h-4 w-4" />
              {content.instagram}
            </a>
          </div>
        </div>
      </div>

      <div className="page-wrap mt-8 flex flex-col items-center justify-between gap-3 border-t border-gold/20 pt-6 text-xs text-ink-muted sm:flex-row">
        <p>&copy; {new Date().getFullYear()} {content.businessName}. All rights reserved.</p>
        <div className="flex gap-4">
          <Link to="/terms" className="hover:text-gold">Terms &amp; Conditions</Link>
          <Link to="/privacy" className="hover:text-gold">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
