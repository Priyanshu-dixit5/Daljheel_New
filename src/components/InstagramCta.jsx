import { Instagram } from 'lucide-react';
import { useContent } from '../context/ContentContext';

export default function InstagramCta() {
  const content = useContent();
  if (!content?.instagramUrl) return null;

  return (
    <section className="bg-cream py-16">
      <div className="page-wrap text-center">
        <p className="section-label mb-3">Stay connected</p>
        <h2 className="section-heading mb-4">Follow us on Instagram</h2>
        <a
          href={content.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-sm border border-gold px-6 py-3 text-sm font-medium text-ink transition hover:bg-gold hover:text-purple-dark"
        >
          <Instagram className="h-4 w-4" />
          {content.instagram}
        </a>
      </div>
    </section>
  );
}
