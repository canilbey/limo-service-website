import { useEffect, Fragment } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Scrolls to top on client-side navigation for better UX.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return <Fragment />;
}
