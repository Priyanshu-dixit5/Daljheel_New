import { createContext, useContext, useEffect, useState } from 'react';
import { fetchContent } from '../api';

const ContentContext = createContext(null);

const fallbackContent = {
  businessName: 'Daljheel Food Mart',
  tagline: 'The Power of Purity',
  whatsappDigits: '918899047015',
  whatsapp: '8899047015',
  phone: '8899047015',
  email: 'daljheelfoodmart@gmail.com',
  instagram: '@daljheelfoodmart',
  instagramUrl: 'https://www.instagram.com/',
  mapUrl: 'https://maps.google.com/',
  address: { line1: 'Daljheel Food Mart', line2: 'Kashmir, India', line3: '' },
  philosophy: ['Pure ingredients', 'Thoughtfully sourced', 'Made for everyday wellness'],
};

export function ContentProvider({ children }) {
  const [content, setContent] = useState(fallbackContent);

  useEffect(() => {
    fetchContent()
      .then((data) =>
        setContent({
          ...fallbackContent,
          ...data,
          address: { ...fallbackContent.address, ...(data.address || {}) },
        })
      )
      .catch(() => {
        setContent(fallbackContent);
      });
  }, []);

  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}

export function useContent() {
  return useContext(ContentContext);
}
