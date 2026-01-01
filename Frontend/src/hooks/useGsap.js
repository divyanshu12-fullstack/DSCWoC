import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook to lazy-load and initialize GSAP
 * GSAP is only loaded when this hook is actually used
 * Returns loading state so components can wait for GSAP before initializing
 */
export const useGsap = () => {
  const gsapRef = useRef(null);
  const scrollTriggerRef = useRef(null);
  const [isGsapLoaded, setIsGsapLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Dynamic import - GSAP only loads when component mounts
    Promise.all([
      import('gsap').then((module) => {
        if (isMounted) gsapRef.current = module.default;
        return module.default;
      }),
      import('gsap/ScrollTrigger').then((module) => {
        if (isMounted) scrollTriggerRef.current = module.ScrollTrigger;
        return module.ScrollTrigger;
      }),
    ]).then(([gsap, ScrollTrigger]) => {
      // Register plugin after both are loaded
      if (isMounted && gsap) {
        gsap.registerPlugin(ScrollTrigger);
        setIsGsapLoaded(true);
      }
    });

    return () => {
      isMounted = false;
      // Cleanup
      if (gsapRef.current && scrollTriggerRef.current) {
        try {
          gsapRef.current.getAll().forEach(animation => animation.kill());
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
  }, []);

  return { 
    gsap: gsapRef.current, 
    ScrollTrigger: scrollTriggerRef.current,
    isLoaded: isGsapLoaded 
  };
};
