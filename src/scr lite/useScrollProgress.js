// src/hooks/useScrollProgress.js
'use client';

import { useState, useEffect } from 'react';

function useScrollProgress() {
  const [scrollPercent, setScrollPercent] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop  = window.pageYOffset;
      const docHeight  = document.body.scrollHeight - window.innerHeight;
      const percent    = docHeight > 0
        ? Math.min((scrollTop / docHeight) * 100, 100)
        : 0;

      setScrollPercent(percent);

      // isScrolled — useful for navbar background change
      // triggers once user scrolls past 50px
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // set initial value on mount

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { scrollPercent, isScrolled };
}

export default useScrollProgress;