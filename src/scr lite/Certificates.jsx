// src/components/sections/Certificates.jsx
'use client';

import Image                     from 'next/image';
import { useState }              from 'react';
import { useGSAPStaggerReveal }  from '@/hooks/useGSAP';
import certificates              from '@/data/certificates';

function CertCard({ cert }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="stagger-item"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:    '#111111',
        border:        `1px solid ${hovered
          ? 'rgba(255, 255, 255, 0.2)'
          : 'rgba(255,255,255,0.05)'}`,
        borderRadius:  '14px',
        padding:       '20px',
        display:       'flex',
        flexDirection: 'column',
        gap:           '14px',
        transition:    'all 0.25s ease',
        transform:     hovered ? 'translateY(-4px)' : 'translateY(0)',
      }}
    >
      {/* Header */}
      <div style={{
        display:        'flex',
        justifyContent: 'space-between',
        alignItems:     'flex-start',
        gap:            '12px',
      }}>
        {/* Logo */}
        <div style={{
          width:     '40px',
          height:    '40px',
          flexShrink:0,
          position:  'relative',
          background:'#1a1a1a',
          borderRadius:'8px',
          border:    '1px solid rgba(255,255,255,0.06)',
          display:   'flex',
          alignItems:'center',
          justifyContent:'center',
          overflow:  'hidden',
          padding:   '6px',
        }}>
          {cert.logo ? (
            <Image
              src={cert.logo}
              alt={cert.issuer}
              fill
              style={{ objectFit: 'contain', padding: '6px' }}
              unoptimized
            />
          ) : (
            <i className="fas fa-certificate"
              style={{ color: '#ffffff', fontSize: '1rem' }} />
          )}
        </div>

        {/* Year badge */}
        <span style={{
          fontFamily:    'JetBrains Mono, monospace',
          fontSize:      '0.65rem',
          color:         '#ffffff',
          padding:       '3px 8px',
          background:    'rgba(255, 255, 255, 0.08)',
          border:        '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius:  '6px',
          letterSpacing: '0.05em',
          whiteSpace:    'nowrap',
        }}>
          {cert.year}
        </span>
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <p style={{
          fontFamily:   'Syne, sans-serif',
          fontSize:     '0.9rem',
          fontWeight:   700,
          color:        '#f5f5f5',
          marginBottom: '4px',
          lineHeight:   1.3,
        }}>
          {cert.title}
        </p>
        <p style={{
          fontFamily:   'JetBrains Mono, monospace',
          fontSize:     '0.7rem',
          color:        '#ffffff',
          marginBottom: '10px',
          opacity:      0.8,
        }}>
          {cert.issuer}
        </p>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize:   '0.8rem',
          color:      '#888888',
          lineHeight: 1.65,
          margin:     0,
        }}>
          {cert.description}
        </p>
      </div>

      {/* View button */}
      <a
        href={cert.link}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-ghost"
        style={{
          padding:        '8px 14px',
          fontSize:       '0.75rem',
          justifyContent: 'center',
          marginTop:      'auto',
        }}
      >
        <i className="fas fa-external-link-alt"
          style={{ fontSize: '0.7rem' }} />
        View Certificate
      </a>
    </div>
  );
}

export default function Certificates() {
  const [showAll, setShowAll] = useState(false);

  const visible = certificates.filter(c => c.visible);
  const extra   = certificates.filter(c => !c.visible);
  const displayed = showAll ? certificates : visible;

  const gridRef = useGSAPStaggerReveal({ stagger: 0.08 });

  return (
    <section
      id="certificates"
      className="section-wrapper"
      style={{ background: '#0a0a0a' }}
    >
      <div style={{ marginBottom: '64px' }}>
        <span className="section-label">// credentials</span>
        <h2 className="section-heading">Certificates</h2>
        <div className="gold-line" />
      </div>

      <div
        ref={gridRef}
        style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap:                 '16px',
          marginBottom:        '40px',
        }}
        className="cert-grid"
      >
        {displayed.map(cert => (
          <CertCard key={cert.id} cert={cert} />
        ))}
      </div>

      {/* Show more/less */}
      {extra.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={() => setShowAll(p => !p)}
            className="btn-ghost"
            style={{ padding: '10px 32px' }}
          >
            {showAll ? (
              <>
                <i className="fas fa-chevron-up"
                  style={{ fontSize: '0.75rem' }} />
                Show Less
              </>
            ) : (
              <>
                <i className="fas fa-chevron-down"
                  style={{ fontSize: '0.75rem' }} />
                Show {extra.length} More
              </>
            )}
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 1024px) {
          .cert-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 640px) {
          .cert-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

    </section>
  );
}