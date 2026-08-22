import { Instagram, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useContent } from '../context/ContentContext';

export default function Contact() {
  const content = useContent();
  if (!content) return null;

  return (
    <section className="bg-cream-light py-12 lg:py-20">
      <div className="page-wrap grid gap-10 lg:grid-cols-2">
        <div>
          <p className="section-label mb-3">Contact</p>
          <h1 className="section-heading mb-6">Find us</h1>
          <p className="mb-8 text-ink-muted">
            Orders are placed through WhatsApp. Share your details and we will confirm personally.
          </p>

          <ul className="space-y-5 text-sm">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-5 w-5 text-gold" />
              <div>
                <p>{content.address.line1}</p>
                <p>{content.address.line2}</p>
                <p>{content.address.line3}</p>
                <a href={content.mapUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-gold">
                  Open map
                </a>
              </div>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-gold" />
              <a href={`tel:${content.phone.replace(/\s/g, '')}`}>{content.phone}</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-gold" />
              <a href={`mailto:${content.email}`}>{content.email}</a>
            </li>
            <li className="flex items-center gap-3">
              <MessageCircle className="h-5 w-5 text-gold" />
              <a href={`https://wa.me/${content.whatsappDigits}`} target="_blank" rel="noopener noreferrer">
                WhatsApp {content.whatsapp}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Instagram className="h-5 w-5 text-gold" />
              <a href={content.instagramUrl} target="_blank" rel="noopener noreferrer">
                {content.instagram}
              </a>
            </li>
          </ul>
        </div>

        <div className="rounded-lg bg-purple p-8 text-cream">
          <h2 className="font-display text-2xl text-gold">Order on WhatsApp</h2>
          <p className="mt-3 text-sm text-cream/80">
            Add items to your cart, enter your details, and we will open WhatsApp with your order
            ready to send. Delivery is confirmed on WhatsApp.
          </p>
          <a
            href={`https://wa.me/${content.whatsappDigits}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold mt-6"
          >
            Message us
          </a>
        </div>
      </div>
    </section>
  );
}
