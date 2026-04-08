// src/components/ui/SectionHeader.jsx
'use client';

import { useGSAPScrollReveal } from '@/hooks/useGSAP';
import { cn } from '@/lib/utils';

function SectionHeader({
  label,              // small gold text above heading e.g. "// about me"
  heading,            // main large heading
  subheading = '',    // optional paragraph below heading
  align = 'left',     // 'left' | 'center'
  className = '',
}) {
  const ref = useGSAPScrollReveal({ y: 24, duration: 0.6 });

  return (
    <div
      ref={ref}
      className={cn(
        'mb-16',
        align === 'center' && 'text-center',
        className
      )}
    >
      {/* Gold mono label */}
      {label && (
        <span className="section-label">{label}</span>
      )}

      {/* Main heading */}
      <h2 className="section-heading">{heading}</h2>

      {/* Thin gold line */}
      <div
        className={cn(
          'gold-line',
          align === 'center' && 'mx-auto'
        )}
      />

      {/* Optional subheading */}
      {subheading && (
        <p
          className={cn(
            'mt-4 text-text-secondary text-base leading-relaxed max-w-2xl',
            align === 'center' && 'mx-auto'
          )}
        >
          {subheading}
        </p>
      )}
    </div>
  );
}

export default SectionHeader;