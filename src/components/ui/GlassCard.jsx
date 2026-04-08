// src/components/ui/GlassCard.jsx
'use client';

import { useGSAPHover } from '@/hooks/useGSAP';
import { cn } from '@/lib/utils';

function GlassCard({
  children,
  className = '',
  hover = true,       // enable/disable GSAP hover lift
  padding = true,     // enable/disable default padding
  onClick,
}) {
  const hoverRef = useGSAPHover({ y: -6, scale: 1.01 });

  return (
    <div
      ref={hover ? hoverRef : null}
      onClick={onClick}
      className={cn(
        'glass-card',
        padding && 'p-6',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}

export default GlassCard;