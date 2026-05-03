// src/components/ui/Notification.jsx
'use client';

import { useEffect, useState } from 'react';

function Notification({ message, onDone }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) return;

    const showTimer = setTimeout(() => setVisible(true), 100);
    const hideTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 300);
    }, 3000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [message]);

  if (!message) return null;

  return (
    <div
      style={{
        position:   'fixed',
        top:        '24px',
        right:      '24px',
        zIndex:     9998,
        transform:  visible ? 'translateX(0)' : 'translateX(120%)',
        transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      <div
        style={{
          display:      'flex',
          alignItems:   'center',
          gap:          '10px',
          padding:      '12px 20px',
          borderRadius: '10px',
          background:   '#111111',
          border:       '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow:    '0 8px 32px rgba(0,0,0,0.4)',
          color:        '#f5f5f5',
          fontSize:     '0.875rem',
          fontWeight:   '500',
          fontFamily:   'Inter, sans-serif',
          whiteSpace:   'nowrap',
        }}
      >
        {/* Gold dot indicator */}
        <span
          style={{
            width:        '6px',
            height:       '6px',
            borderRadius: '50%',
            background:   '#ffffff',
            flexShrink:   0,
          }}
        />
        {message}
      </div>
    </div>
  );
}

export default Notification;