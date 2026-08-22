import { Phone } from 'lucide-react';
import { useContent } from '../context/ContentContext';

export default function AnnouncementBar() {
  const content = useContent();
  const phone = content?.phone || '8899047015';
  return <div className="bg-[#24513f] px-3 py-2 font-mono text-[10px] tracking-wide text-[#f8f2e8] sm:px-4 sm:text-xs"><div className="mx-auto flex max-w-7xl items-center justify-between gap-2 sm:justify-center sm:gap-5"><span className="whitespace-nowrap">Free Delivery</span><span className="hidden h-3 w-px bg-[#d59a2b]/70 sm:block" /><span className="whitespace-nowrap">Kashmiri With Care</span><span className="h-3 w-px bg-[#d59a2b]/70" /><a href={`tel:${phone.replace(/\s/g, '')}`} className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap transition hover:text-[#d59a2b]"><Phone className="h-3 w-3" /><span>{phone}</span></a></div></div>;
}
