// src/components/sections/Skills.jsx
'use client';

import Image                   from 'next/image';
import { useGSAPScrollReveal } from '@/hooks/useGSAP';
import skills                  from '@/data/skills';

function getAllSkills() {
  return Object.values(skills).flat();
}

// ─── Single logo ──────────────────────────────────────
function LogoItem({ skill }) {
  return (
    <a
      href={skill.link}
      target="_blank"
      rel="noopener noreferrer"
      title={skill.name}
      style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        width:          '64px',
        height:         '64px',
        flexShrink:     0,
        textDecoration: 'none',
        background:     'none',
        border:         'none',
        padding:        '0',
        cursor:         'pointer',
      }}
      onMouseEnter={e => {
        const img = e.currentTarget.querySelector('img');
        if (img) {
          img.style.transform = 'scale(1.2)';
          img.style.opacity   = '1';
        }
      }}
      onMouseLeave={e => {
        const img = e.currentTarget.querySelector('img');
        if (img) {
          img.style.transform = 'scale(1)';
          img.style.opacity   = '0.7';
        }
      }}
    >
      <div style={{
        width:    '52px',
        height:   '52px',
        position: 'relative',
      }}>
        <Image
          src={skill.logo}
          alt={skill.name}
          fill
          sizes="52px"
          style={{
            objectFit:  'contain',
            opacity:    '0.7',          // ← slightly dimmed at rest
            transition: 'all 0.3s ease',
            filter:     'none',         // ← no filter, full colour always
          }}
          unoptimized={skill.logo.startsWith('http')}
          onError={e => { e.currentTarget.style.display = 'none'; }}
        />
      </div>
    </a>
  );
}
// ─── Infinite carousel row ────────────────────────────
function CarouselRow({ items, duration }) {
  // Repeat enough times to fill any screen seamlessly
  const repeated = [...items, ...items, ...items, ...items];

  return (
    <div style={{
      overflow:        'hidden',
      width:           '100vw',
      marginLeft:      'calc(-50vw + 50%)',
      maskImage:       'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
      WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
    }}>
      <div
        style={{
          display:   'flex',
          alignItems:'center',
          gap:       '40px',           // generous gap between logos
          width:     'max-content',
          padding:   '16px 0',
          animation: `scrollForward ${duration}s linear infinite`,
        }}
        onMouseEnter={e =>
          e.currentTarget.style.animationPlayState = 'paused'}
        onMouseLeave={e =>
          e.currentTarget.style.animationPlayState = 'running'}
      >
        {repeated.map((skill, i) => (
          <LogoItem key={`${skill.name}-${i}`} skill={skill} />
        ))}
      </div>
    </div>
  );
}

// ─── Main section ─────────────────────────────────────
export default function Skills() {
  const headerRef   = useGSAPScrollReveal({ y: 24, duration: 0.6 });
  const carouselRef = useGSAPScrollReveal({ y: 32, duration: 0.6, delay: 0.15 });

  const allSkills = getAllSkills();

  return (
    <section
      id="skills"
      style={{
        background: '#080808',
        padding:    '96px 0',
        overflow:   'hidden',
      }}
    >

      {/* ── Header ── */}
      <div
        ref={headerRef}
        style={{
          maxWidth:     '1152px',
          margin:       '0 auto',
          padding:      '0 24px',
          marginBottom: '56px',
        }}
      >
        <span className="section-label">// tools of the trade</span>
        <h2 className="section-heading">Skills & Expertise</h2>
        <div className="gold-line" />
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize:   '1rem',
          color:      '#555555',
          marginTop:  '16px',
          lineHeight: 1.7,
        }}>
          Hover to reveal.
        </p>
      </div>

      {/* ── Single carousel row ── */}
      <div ref={carouselRef}>
        <CarouselRow items={allSkills} duration={45} />
      </div>

      <style>{`
        @keyframes scrollForward {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

    </section>
  );
}