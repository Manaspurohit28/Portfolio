// src/components/sections/About.jsx
'use client';

import Image                     from 'next/image';
import { useGSAPScrollReveal }   from '@/hooks/useGSAP';
import { SITE }                  from '@/lib/constants';

// ─── Small fact chip ──────────────────────────────────
function FactChip({ icon, text }) {
  return (
    <div style={{
      display:     'flex',
      alignItems:  'center',
      gap:         '8px',
      padding:     '8px 14px',
      background:  '#111111',
      border:      '1px solid rgba(255,255,255,0.06)',
      borderRadius:'10px',
      fontSize:    '0.8rem',
      color:       '#888888',
      fontFamily:  'JetBrains Mono, monospace',
      whiteSpace:  'nowrap',
    }}>
      <span style={{ fontSize: '1rem' }}>{icon}</span>
      {text}
    </div>
  );
}

export default function About() {
  const leftRef  = useGSAPScrollReveal({ y: 40, duration: 0.7 });
  const rightRef = useGSAPScrollReveal({ y: 40, duration: 0.7, delay: 0.15 });

  return (
    <section id="about" className="section-wrapper">

      {/* Section header */}
      <div style={{ marginBottom: '64px' }}>
        <span className="section-label">// about me</span>
        <h2 className="section-heading">Who I Am</h2>
        <div className="gold-line" />
      </div>

      {/* Two column layout */}
      <div style={{
        display:             'grid',
        gridTemplateColumns: '1fr 1fr',
        gap:                 '64px',
        alignItems:          'start',
      }}
        className="about-grid"
      >

        {/* ── Left — text ── */}
        <div ref={leftRef}>
          <p style={{
            fontFamily:  'Inter, sans-serif',
            fontSize:    '1.05rem',
            color:       '#888888',
            lineHeight:  1.85,
            marginBottom:'24px',
          }}>
            I am an aspiring Software Engineer with a strong foundation
            in Python, C++, HTML, and CSS. I thrive in collaborative,
            fast-paced environments and bring a problem-solving mindset
            fueled by adaptability and clear communication.
          </p>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize:   '1.05rem',
            color:      '#888888',
            lineHeight: 1.85,
          }}>
            Passionate about applying academic knowledge to real-world
            challenges, I continuously learn new technologies and aim
            to contribute meaningfully in the ever-evolving tech industry.
          </p>

          {/* Fact chips */}
          <div style={{
            display:   'flex',
            flexWrap:  'wrap',
            gap:       '10px',
            marginTop: '36px',
          }}>
            <FactChip icon="📍" text={SITE.location}     />
            <FactChip icon="🎓" text="BTech CSE — 2025"  />
            <FactChip icon="💼" text="2 Internships"      />
            <FactChip icon="🌐" text="Open to Remote"     />
          </div>

          {/* CTA */}
          <div style={{ marginTop: '36px', display: 'flex', gap: '12px' }}>
            <a href={SITE.linkedin} target="_blank"
              rel="noopener noreferrer" className="btn-primary">
              <i className="fab fa-linkedin" style={{ fontSize: '0.85rem' }} />
              LinkedIn
            </a>
            <a href={SITE.github} target="_blank"
              rel="noopener noreferrer" className="btn-ghost">
              <i className="fab fa-github" style={{ fontSize: '0.85rem' }} />
              GitHub
            </a>
          </div>
        </div>

        {/* ── Right — image ── */}
        <div ref={rightRef} style={{ position: 'relative' }}>

          {/* Gold accent border offset */}
          <div style={{
            position:     'absolute',
            top:          '16px',
            left:         '16px',
            right:        '-16px',
            bottom:       '-16px',
            border:       '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '20px',
            zIndex:       0,
          }} />

          {/* Image container */}
          <div style={{
            position:     'relative',
            borderRadius: '20px',
            overflow:     'hidden',
            border:       '1px solid rgba(255,255,255,0.06)',
            aspectRatio:  '4/5',
            zIndex:       1,
          }}>
            <Image
              src="/images/generated-image-t.png"
              alt="Manas Purohit"
              fill
              style={{ objectFit: 'cover', objectPosition: 'top' }}
            />

            {/* Subtle bottom gradient on image */}
            <div style={{
              position:   'absolute',
              bottom:     0,
              left:       0,
              right:      0,
              height:     '40%',
              background: 'linear-gradient(to top, rgba(8,8,8,0.7), transparent)',
            }} />
          </div>

          {/* Floating badge */}
          <div style={{
            position:     'absolute',
            bottom:       '24px',
            left:         '-20px',
            zIndex:       2,
            padding:      '10px 16px',
            background:   '#111111',
            border:       '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
          }}>
            <p style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize:   '0.65rem',
              color:      '#ffffff',
              margin:     0,
            }}>
              Currently exploring
            </p>
            <p style={{
              fontFamily: 'Syne, sans-serif',
              fontSize:   '0.85rem',
              fontWeight: 700,
              color:      '#f5f5f5',
              margin:     '2px 0 0',
            }}>
              GenAI + RAG Systems
            </p>
          </div>

        </div>

      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 768px) {
          .about-grid {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
        }
      `}</style>

    </section>
  );
}