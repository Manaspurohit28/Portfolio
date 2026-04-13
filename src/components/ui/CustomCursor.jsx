// src/components/ui/CustomCursor.jsx
'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef    = useRef(null);
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const mouse     = useRef({ x: -200, y: -200 });
  const rafId     = useRef(null);

  useEffect(() => {
    document.documentElement.style.cursor = 'none';

    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };

      // Move dot instantly
      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate(${e.clientX}px, ${e.clientY}px)`;
      }

      // Spawn 2–3 particles per move
      const count = Math.floor(Math.random() * 2) + 2;
      for (let i = 0; i < count; i++) {
        particles.current.push({
          x:     e.clientX + (Math.random() - 0.5) * 6,
          y:     e.clientY + (Math.random() - 0.5) * 6,
          vx:    (Math.random() - 0.5) * 0.6,
          vy:    (Math.random() - 0.5) * 0.6,
          alpha: Math.random() * 0.6 + 0.4,
          size:  Math.random() * 1.5 + 0.5,
          decay: Math.random() * 0.018 + 0.012,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current = particles.current.filter(p => p.alpha > 0);

      for (const p of particles.current) {
        p.x     += p.vx;
        p.y     += p.vy;
        p.alpha -= p.decay;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, p.alpha)})`;
        ctx.fill();
      }

      rafId.current = requestAnimationFrame(animate);
    };
    rafId.current = requestAnimationFrame(animate);

    window.addEventListener('mousemove', onMove, { passive: true });

    return () => {
      document.documentElement.style.cursor = '';
      cancelAnimationFrame(rafId.current);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize',    resize);
    };
  }, []);

  return (
    <>
      {/* Canvas for stardust trail */}
      <canvas
        ref={canvasRef}
        style={{
          position:      'fixed',
          inset:         0,
          zIndex:        9999,
          pointerEvents: 'none',
        }}
      />

      {/* Sharp dot cursor */}
      <div
        ref={dotRef}
        style={{
          position:      'fixed',
          top:           0,
          left:          0,
          zIndex:        10000,
          pointerEvents: 'none',
          width:         '6px',
          height:        '6px',
          marginLeft:    '-3px',
          marginTop:     '-3px',
          borderRadius:  '50%',
          background:    '#ffffff',
          mixBlendMode:  'difference',
        }}
      />
    </>
  );
}