// src/components/layout/Navbar.jsx
'use client';

import { useState, useEffect } from 'react';
import useScrollProgress        from '@/hooks/useScrollProgress';
import { NAV_LINKS, SITE }      from '@/lib/constants';

// ─── Main Navbar ──────────────────────────────────────
export default function Navbar() {
  const { isScrolled }                  = useScrollProgress();
  const [menuOpen, setMenuOpen]         = useState(false);
  const [activeSection, setActiveSection] = useState('');

  // Track which section is in view
  useEffect(() => {
    const ids = NAV_LINKS.map(l => l.href.replace('#', ''));

    const observers = ids.map(id => {
      const el = document.getElementById(id);
      if (!el) return null;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.3 }
      );

      obs.observe(el);
      return obs;
    });

    return () => observers.forEach(o => o?.disconnect());
  }, []);

  // Close menu on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleNavClick = () => setMenuOpen(false);

  return (
    <>
      {/* ── Main nav bar ── */}
      <nav
        style={{
          position:             'fixed',
          top:                  0,
          left:                 0,
          right:                0,
          width:                '100%',
          zIndex:               1000,
          transition:           'all 0.3s ease',
          padding:              isScrolled ? '12px 0' : '20px 0',
          background:           isScrolled
            ? 'rgba(8,8,8,0.92)'
            : 'transparent',
          backdropFilter:       isScrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: isScrolled ? 'blur(20px)' : 'none',
          borderBottom:         isScrolled
            ? '1px solid rgba(255,255,255,0.05)'
            : 'none',
        }}
      >
        <div style={{
          maxWidth:       '1152px',
          margin:         '0 auto',
          padding:        '0 24px',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          width:          '100%',
        }}>

          {/* ── Logo ── */}
          <a
            href="#"
            style={{
              fontFamily:     'Syne, sans-serif',
              fontWeight:     800,
              fontSize:       '1.2rem',
              color:          '#f5f5f5',
              textDecoration: 'none',
              transition:     'color 0.2s ease',
              flexShrink:     0,
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
            onMouseLeave={e => e.currentTarget.style.color = '#f5f5f5'}
          >
            {SITE.name.split(' ')[0]}
            <span style={{ color: '#ffffff' }}>.</span>
          </a>

          {/* ── Desktop nav links ── */}
          <div
            className="desktop-nav"
            style={{
              display:    'none',
              alignItems: 'center',
              gap:        '32px',
            }}
          >
            {NAV_LINKS.map(link => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a
                  key={link.href}
                  href={link.href}
                  style={{
                    fontFamily:     'JetBrains Mono, monospace',
                    fontSize:       '0.72rem',
                    letterSpacing:  '0.15em',
                    textTransform:  'uppercase',
                    textDecoration: 'none',
                    color:          isActive ? '#ffffff' : '#888888',
                    transition:     'color 0.2s ease',
                    position:       'relative',
                    paddingBottom:  '2px',
                    whiteSpace:     'nowrap',
                  }}
                  onMouseEnter={e => {
                    if (!isActive)
                      e.currentTarget.style.color = '#f5f5f5';
                  }}
                  onMouseLeave={e => {
                    if (!isActive)
                      e.currentTarget.style.color = '#888888';
                  }}
                >
                  {link.label}
                  {isActive && (
                    <span style={{
                      position:   'absolute',
                      bottom:     '-2px',
                      left:       0,
                      right:      0,
                      height:     '1px',
                      background: '#ffffff',
                    }} />
                  )}
                </a>
              );
            })}
          </div>

          {/* ── Desktop right — Resume button only ── */}
          <div
            className="desktop-right"
            style={{
              display:    'none',
              alignItems: 'center',
            }}
          >
            <a
              href={SITE.resume}
              download
              className="btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.78rem' }}
            >
              Resume
            </a>
          </div>

          {/* ── Mobile hamburger only ── */}
          <div
            className="mobile-controls"
            style={{
              display:    'flex',
              alignItems: 'center',
            }}
          >
            <button
              onClick={() => setMenuOpen(p => !p)}
              aria-label="Toggle menu"
              style={{
                width:          '36px',
                height:         '36px',
                borderRadius:   '8px',
                display:        'flex',
                flexDirection:  'column',
                alignItems:     'center',
                justifyContent: 'center',
                gap:            '5px',
                background:     'transparent',
                border:         '1px solid rgba(255,255,255,0.08)',
                cursor:         'pointer',
                padding:        0,
                flexShrink:     0,
              }}
            >
              <span style={{
                display:    'block',
                width:      '16px',
                height:     '1.5px',
                background: '#888888',
                transition: 'all 0.25s ease',
                transform:  menuOpen
                  ? 'rotate(45deg) translateY(6.5px)'
                  : 'none',
              }} />
              <span style={{
                display:    'block',
                width:      '16px',
                height:     '1.5px',
                background: '#888888',
                transition: 'all 0.25s ease',
                opacity:    menuOpen ? 0 : 1,
                transform:  menuOpen ? 'scaleX(0)' : 'scaleX(1)',
              }} />
              <span style={{
                display:    'block',
                width:      '16px',
                height:     '1.5px',
                background: '#888888',
                transition: 'all 0.25s ease',
                transform:  menuOpen
                  ? 'rotate(-45deg) translateY(-6.5px)'
                  : 'none',
              }} />
            </button>
          </div>

        </div>
      </nav>

      {/* ── Mobile menu overlay ── */}
      <div
        style={{
          position:      'fixed',
          inset:         0,
          zIndex:        999,
          pointerEvents: menuOpen ? 'auto' : 'none',
          opacity:       menuOpen ? 1 : 0,
          transition:    'opacity 0.3s ease',
        }}
      >
        {/* Backdrop */}
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position:             'absolute',
            inset:                0,
            background:           'rgba(8,8,8,0.95)',
            backdropFilter:       'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        />

        {/* Slide-in panel */}
        <div
          style={{
            position:      'absolute',
            top:           0,
            right:         0,
            height:        '100%',
            width:         '280px',
            background:    '#111111',
            borderLeft:    '1px solid rgba(255,255,255,0.05)',
            display:       'flex',
            flexDirection: 'column',
            padding:       '100px 32px 40px',
            transform:     menuOpen ? 'translateX(0)' : 'translateX(100%)',
            transition:    'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >

          {/* Mobile nav links */}
          <div style={{
            display:       'flex',
            flexDirection: 'column',
            gap:           '28px',
            flex:          1,
          }}>
            {NAV_LINKS.map((link, i) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={handleNavClick}
                  style={{
                    fontFamily:     'Syne, sans-serif',
                    fontSize:       '1.5rem',
                    fontWeight:     700,
                    color:          isActive ? '#ffffff' : '#f5f5f5',
                    textDecoration: 'none',
                    transition:     'color 0.2s ease',
                    animation:      menuOpen
                      ? `fadeInUp 0.4s ease ${i * 0.05}s both`
                      : 'none',
                  }}
                  onMouseEnter={e => {
                    if (!isActive)
                      e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={e => {
                    if (!isActive)
                      e.currentTarget.style.color = '#f5f5f5';
                  }}
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          {/* Bottom of mobile panel */}
          <div>
            <a
              href={SITE.resume}
              download
              onClick={handleNavClick}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Download Resume
            </a>

            {/* Social icons */}
            <div style={{
              display:   'flex',
              gap:       '12px',
              marginTop: '20px',
            }}>
              {[
                { href: SITE.github,    icon: 'fab fa-github',    label: 'GitHub'    },
                { href: SITE.linkedin,  icon: 'fab fa-linkedin',  label: 'LinkedIn'  },
                { href: SITE.instagram, icon: 'fab fa-instagram', label: 'Instagram' },
              ].map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  style={{
                    width:          '36px',
                    height:         '36px',
                    borderRadius:   '8px',
                    border:         '1px solid rgba(255,255,255,0.08)',
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                    color:          '#444444',
                    fontSize:       '0.95rem',
                    textDecoration: 'none',
                    transition:     'all 0.2s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color       = '#ffffff';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color       = '#444444';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  }}
                >
                  <i className={s.icon} />
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Responsive rules ── */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav     { display: flex !important; }
          .desktop-right   { display: flex !important; }
          .mobile-controls { display: none !important; }
        }
        @media (max-width: 767px) {
          .desktop-nav     { display: none !important; }
          .desktop-right   { display: none !important; }
          .mobile-controls { display: flex !important; }
        }
      `}</style>
    </>
  );
}