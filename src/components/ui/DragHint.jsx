// src/components/ui/DragHint.jsx
'use client';

import { useState, useEffect } from 'react';

export default function DragHint() {
  const [visible,  setVisible]  = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Show hint after 2.5s — give hero animations time to finish
    const showTimer = setTimeout(() => {
      setVisible(true);
    }, 2500);

    // Auto dismiss after 6s
    const hideTimer = setTimeout(() => {
      setVisible(false);
      setDismissed(true);
    }, 8000);

    // Dismiss on first mousedown anywhere on hero canvas
    const handleDrag = () => {
      setVisible(false);
      setDismissed(true);
    };

    window.addEventListener('mousedown', handleDrag, { once: true });
    window.addEventListener('touchstart', handleDrag, { once: true });

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      window.removeEventListener('mousedown', handleDrag);
      window.removeEventListener('touchstart', handleDrag);
    };
  }, []);

  if (dismissed) return null;

  return (
    <div
      style={{
        position:   'fixed',
        bottom:     '80px',
        left:       '50%',
        transform:  'translateX(-50%)',
        zIndex:     500,
        opacity:    visible ? 1 : 0,
        transition: 'opacity 0.6s ease',
        pointerEvents: 'none',
      }}
    >
      <div style={{
        display:    'flex',
        alignItems: 'center',
        gap:        '8px',
        padding:    '7px 14px',
        background: 'rgba(8,8,8,0.7)',
        backdropFilter: 'blur(8px)',
        border:     '1px solid rgba(255,255,255,0.06)',
        borderRadius:'20px',
        whiteSpace: 'nowrap',
      }}>
        {/* Drag icon */}
        <svg width="12" height="12" viewBox="0 0 24 24"
          fill="none" stroke="rgb(255, 255, 255)" strokeWidth="2"
          strokeLinecap="round">
          <polyline points="5 9 2 12 5 15"/>
          <polyline points="9 5 12 2 15 5"/>
          <polyline points="15 19 12 22 9 19"/>
          <polyline points="19 9 22 12 19 15"/>
          <line x1="2"  y1="12" x2="22" y2="12"/>
          <line x1="12" y1="2"  x2="12" y2="22"/>
        </svg>

        <span style={{
          fontFamily:    'JetBrains Mono, monospace',
          fontSize:      '0.6rem',
          color:         'rgba(255,255,255,0.35)',
          letterSpacing: '0.08em',
        }}>
          drag to explore
        </span>
      </div>
    </div>
  );
}