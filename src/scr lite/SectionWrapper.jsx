// src/components/ui/SectionWrapper.jsx
'use client';

import { useGSAPScrollReveal } from '@/hooks/useGSAP';
import { cn } from '@/lib/utils';

function SectionWrapper({
  children,
  id = '',
  className = '',
  animate = true,    // set false for Hero (it has its own animation)
  style = {},
}) {
  const revealRef = useGSAPScrollReveal({ y: 32, duration: 0.7 });

  return (
    <section
      id={id}
      ref={animate ? revealRef : null}
      style={style}
      className={cn('section-wrapper', className)}
    >
      {children}
    </section>
  );
}

export default SectionWrapper;