import { Box } from '@mui/material';
import { type ReactNode, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { brandColors } from '../../theme';

interface PublicPageLayoutProps {
  children: ReactNode;
  /** Updates document title for basic SEO */
  title: string;
  metaDescription?: string;
}

export default function PublicPageLayout({ children, title, metaDescription }: PublicPageLayoutProps) {
  useEffect(() => {
    document.title = `${title} | Budget Limousine`;
    if (metaDescription) {
      let el = document.querySelector('meta[name="description"]');
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', 'description');
        document.head.appendChild(el);
      }
      el.setAttribute('content', metaDescription);
    }
  }, [title, metaDescription]);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: brandColors.background, display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <Box component="main" sx={{ flex: 1, pt: { xs: 10, md: 12 }, pb: 6 }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
}
