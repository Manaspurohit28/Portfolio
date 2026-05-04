// src/components/layout/Footer.jsx
import { SITE, NAV_LINKS } from '@/lib/constants';

export default function Footer() {
  const year = new Date().getFullYear();

  const socials = [
    { href: SITE.github,    icon: 'fab fa-github',    label: 'GitHub'    },
    { href: SITE.linkedin,  icon: 'fab fa-linkedin',  label: 'LinkedIn'  },
    { href: SITE.instagram, icon: 'fab fa-instagram', label: 'Instagram' },
  ];

  return (
    <footer style={{
      width:       '100%',
      background:  '#080808',
      borderTop:   '1px solid rgba(255,255,255,0.05)',
    }}>
      <div style={{
        margin:      '0 auto',
        padding:     '48px 157px',
        width:       '100%',
      }}>

        {/* Top row */}
        <div style={{
          display:        'flex',
          flexWrap:       'wrap',
          alignItems:     'flex-start',
          justifyContent: 'space-between',
          gap:            '32px',
          marginBottom:   '40px',
        }}>

          {/* Left — name */}
          <div>
            <p style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              fontSize:   '1.2rem',
              color:      '#f5f5f5',
              margin:     0,
            }}>
              {SITE.name.split(' ')[0]}
              <span style={{ color: '#ffffff' }}>.</span>
            </p>
            <p style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize:   '0.72rem',
              color:      '#888888',
              marginTop:  '6px',
            }}>
              {SITE.role}
            </p>
          </div>

          {/* Center — nav links */}
          <div style={{
            display:  'flex',
            flexWrap: 'wrap',
            gap:      '24px',
          }}>
            {NAV_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                style={{
                  fontFamily:     'JetBrains Mono, monospace',
                  fontSize:       '0.7rem',
                  letterSpacing:  '0.15em',
                  textTransform:  'uppercase',
                  textDecoration: 'none',
                  color:          '#444444',
                  transition:     'color 0.2s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
                onMouseLeave={e => e.currentTarget.style.color = '#444444'}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right — socials */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {socials.map(s => (
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
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  border:         '1px solid rgba(255,255,255,0.06)',
                  color:          '#444444',
                  textDecoration: 'none',
                  fontSize:       '0.9rem',
                  transition:     'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color       = '#ffffff';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color       = '#444444';
                  e.currentTarget.style.borderColor = 'rgb(255, 255, 255, 0.25)';
                }}
              >
                <i className={s.icon} />
              </a>
            ))}
          </div>

        </div>

        {/* Divider */}
        <div style={{
          height:       '1px',
          background:   'rgba(255,255,255,0.04)',
          marginBottom: '32px',
        }} />

        {/* Bottom row */}
        <div style={{
          display:        'flex',
          flexWrap:       'wrap',
          alignItems:     'center',
          justifyContent: 'space-between',
          gap:            '12px',
        }}>
          <p style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize:   '0.7rem',
            color:      '#444444',
            margin:     0,
          }}>
            © {year} {SITE.name}. All rights reserved.
          </p>
          <p style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize:   '0.7rem',
            color:      '#444444',
            margin:     0,
            display:    'flex',
            gap:        '6px',
            alignItems: 'center',
          }}>
            Built with
            <span style={{ color: '#ffffff' }}>Next.js</span>
            +
            <span style={{ color: '#ffffff' }}>Tailwind</span>
            +
            <span style={{ color: '#ffffff' }}>Three.js</span>
          </p>
        </div>

      </div>
    </footer>
  );
}