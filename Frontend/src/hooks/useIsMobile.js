import { useState, useEffect } from 'react';

// Detect mobile width on first paint to avoid a desktop-first render flicker
// that can briefly attach desktop-only animations and then hide content on phones.
const getIsMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
};

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(getIsMobile);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(getIsMobile());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
};
