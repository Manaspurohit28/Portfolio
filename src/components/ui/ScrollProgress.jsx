// src/components/ui/ScrollProgress.jsx
'use client';

import useScrollProgress from '@/hooks/useScrollProgress';

export default function ScrollProgress() {
  const { scrollPercent } = useScrollProgress();

  return (
    <div
      style={{
        position:      'fixed',
        top:           0,
        left:          0,
        width:         `${scrollPercent}%`,
        height:        '2px',
        background:    '#ffffff',     
        zIndex:        9999,
        transition:    'width 0.1s ease',
        pointerEvents: 'none',
        opacity:       0.6,
      }}
    />
  );
}