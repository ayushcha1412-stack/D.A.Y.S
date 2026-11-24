import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop
 *
 * Resets the window scroll position to (0, 0) whenever the pathname changes.
 * Skips anchor-link navigations (paths containing "#") so intentional
 * same-page section scrolls (e.g. /#connect) are not interrupted.
 *
 * Place this component inside <BrowserRouter> but outside any page component.
 * It renders nothing — it is a side-effect only.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If the URL has a hash (e.g. /#connect), let the browser handle it
    if (hash) return;

    // Instant scroll — the page entrance animation starts from the top
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
