// src/components/sections/Contact.jsx
'use client';

import { useState }            from 'react';
import { useGSAPScrollReveal } from '@/hooks/useGSAP';
import { SITE }                from '@/lib/constants';

// ─── Input field ──────────────────────────────────────
function Field({
  label,
  name,
  type       = 'text',
  placeholder,
  value,
  onChange,
  required   = true,
  multiline  = false,
  rows       = 5,
}) {
  const [focused, setFocused] = useState(false);

  const baseStyle = {
    width:        '100%',
    background:   '#111111',
    border:       `1px solid ${focused
      ? 'rgba(255, 255, 255, 0.4)'
      : 'rgba(255,255,255,0.07)'}`,
    borderRadius: '10px',
    padding:      '14px 16px',
    fontFamily:   'Inter, sans-serif',
    fontSize:     '0.9rem',
    color:        '#f5f5f5',
    outline:      'none',
    transition:   'border-color 0.2s ease, box-shadow 0.2s ease',
    boxShadow:    focused
      ? '0 0 0 3px rgba(255, 255, 255, 0.06)'
      : 'none',
    resize:       multiline ? 'vertical' : 'none',
    display:      'block',
    boxSizing:    'border-box',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label style={{
        fontFamily:    'JetBrains Mono, monospace',
        fontSize:      '0.7rem',
        color:         focused ? '#ffffff' : '#888888',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        transition:    'color 0.2s ease',
      }}>
        {label}
        {required && (
          <span style={{ color: '#ffffff', marginLeft: '4px' }}>*</span>
        )}
      </label>

      {multiline ? (
        <textarea
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          rows={rows}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={baseStyle}
        />
      ) : (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={baseStyle}
        />
      )}
    </div>
  );
}

// ─── Main Contact section ─────────────────────────────
export default function Contact({ setNotification }) {
  const leftRef  = useGSAPScrollReveal({ y: 40, duration: 0.7 });
  const rightRef = useGSAPScrollReveal({ y: 40, duration: 0.7, delay: 0.15 });

  const [formData, setFormData] = useState({
    name:    '',
    email:   '',
    message: '',
  });
  const [status, setStatus] = useState('idle');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const res = await fetch('https://formspree.io/f/xnjgyqlj', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('sent');
        setFormData({ name: '', email: '', message: '' });
        setNotification('Message sent successfully!');
      } else {
        setStatus('error');
        setNotification('Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setNotification('Something went wrong. Please try again.');
    }

    setTimeout(() => setStatus('idle'), 4000);
  };

  return (
    <section id="contact" className="section-wrapper">

      {/* Section heading */}
      <div style={{ marginBottom: '64px' }}>
        <span className="section-label">// get in touch</span>
        <h2 className="section-heading">Contact</h2>
        <div className="gold-line" />
      </div>

      <div
        style={{
          display:             'grid',
          gridTemplateColumns: '1fr 1fr',
          gap:                 '80px',
          alignItems:          'start',
        }}
        className="contact-grid"
      >

        {/* ── Left — heading + info only ── */}
        <div ref={leftRef}>
          <h3 style={{
            fontFamily:   'Syne, sans-serif',
            fontSize:     'clamp(1.5rem, 3vw, 2.2rem)',
            fontWeight:   800,
            color:        '#f5f5f5',
            lineHeight:   1.2,
            marginBottom: '20px',
          }}>
            Let's build something
            <br />
            <span style={{ color: '#ffffff' }}>great together.</span>
          </h3>

          <p style={{
            fontFamily:   'Inter, sans-serif',
            fontSize:     '1rem',
            color:        '#888888',
            lineHeight:   1.8,
            marginBottom: '40px',
            maxWidth:     '380px',
          }}>
            I'm currently open to internship and full-time opportunities.
            Whether you have a project in mind or just want to say hello —
            fill in the form and I'll get back to you as soon as possible.
          </p>

          {/* Email + Location info rows */}
          <div style={{
            display:       'flex',
            flexDirection: 'column',
            gap:           '16px',
          }}>
            {[
              {
                icon:  'fas fa-envelope',
                label: 'Email',
                value: SITE.email,
              },
              {
                icon:  'fas fa-map-marker-alt',
                label: 'Location',
                value: SITE.location,
              },
              {
                icon:  'fas fa-clock',
                label: 'Response Time',
                value: 'Within 24 hours',
              },
            ].map(item => (
              <div key={item.label} style={{
                display:    'flex',
                alignItems: 'center',
                gap:        '14px',
              }}>
                {/* Icon */}
                <div style={{
                  width:          '36px',
                  height:         '36px',
                  borderRadius:   '8px',
                  background:     'rgba(255, 255, 255, 0.06)',
                  border:         '1px solid rgba(255, 255, 255, 0.12)',
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  flexShrink:     0,
                }}>
                  <i className={item.icon}
                    style={{ color: '#ffffff', fontSize: '0.8rem' }} />
                </div>

                {/* Text */}
                <div>
                  <p style={{
                    fontFamily:    'JetBrains Mono, monospace',
                    fontSize:      '0.62rem',
                    color:         '#444444',
                    margin:        '0 0 2px',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}>
                    {item.label}
                  </p>
                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize:   '0.875rem',
                    color:      '#888888',
                    margin:     0,
                  }}>
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Social links row */}
          <div style={{
            display:    'flex',
            gap:        '12px',
            marginTop:  '40px',
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
                  width:          '40px',
                  height:         '40px',
                  borderRadius:   '10px',
                  border:         '1px solid rgba(255, 255, 255, 0.06)',
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  color:          '#444444',
                  fontSize:       '1rem',
                  textDecoration: 'none',
                  transition:     'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color       = '#ffffff';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                  e.currentTarget.style.background  = 'rgba(255, 255, 255, 0.06)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color       = '#444444';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.background  = 'transparent';
                }}
              >
                <i className={s.icon} />
              </a>
            ))}
          </div>

        </div>

        {/* ── Right — form ── */}
        <div ref={rightRef}>
          <form
            onSubmit={handleSubmit}
            style={{
              background:    '#111111',
              border:        '1px solid rgba(255,255,255,0.05)',
              borderRadius:  '16px',
              padding:       '32px',
              display:       'flex',
              flexDirection: 'column',
              gap:           '24px',
            }}
          >

            {/* Name + Email row */}
            <div
              style={{
                display:             'grid',
                gridTemplateColumns: '1fr 1fr',
                gap:                 '16px',
              }}
              className="form-row"
            >
              <Field
                label="Name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
              />
              <Field
                label="Email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Message */}
            <Field
              label="Message"
              name="message"
              placeholder="Tell me about your project or just say hello..."
              value={formData.message}
              onChange={handleChange}
              multiline
              rows={6}
            />

            {/* Submit button */}
            <button
              type="submit"
              disabled={status === 'sending' || status === 'sent'}
              style={{
                width:          '100%',
                padding:        '14px',
                borderRadius:   '10px',
                border:         status === 'sent'
                  ? '1px solid rgba(34,197,94,0.3)'
                  : 'none',
                background:     status === 'sent'
                  ? 'rgba(34,197,94,0.1)'
                  : '#ffffff',
                color:          status === 'sent' ? '#22c55e' : '#080808',
                fontFamily:     'Syne, sans-serif',
                fontWeight:     700,
                fontSize:       '0.95rem',
                cursor:         status === 'sending' || status === 'sent'
                  ? 'not-allowed'
                  : 'pointer',
                transition:     'all 0.25s ease',
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                gap:            '8px',
                opacity:        status === 'sending' ? 0.7 : 1,
              }}
              onMouseEnter={e => {
                if (status === 'idle') {
                  e.currentTarget.style.background = '#ffffff';
                  e.currentTarget.style.transform  = 'translateY(-2px)';
                }
              }}
              onMouseLeave={e => {
                if (status === 'idle') {
                  e.currentTarget.style.background = '#ffffff';
                  e.currentTarget.style.transform  = 'translateY(0)';
                }
              }}
            >
              {status === 'idle' && (
                <>
                  Send Message
                  <i className="fas fa-paper-plane"
                    style={{ fontSize: '0.85rem' }} />
                </>
              )}
              {status === 'sending' && (
                <>
                  <span style={{
                    width:        '14px',
                    height:       '14px',
                    border:       '2px solid rgba(8,8,8,0.3)',
                    borderTop:    '2px solid #080808',
                    borderRadius: '50%',
                    animation:    'spin 0.8s linear infinite',
                    display:      'inline-block',
                  }} />
                  Sending...
                </>
              )}
              {status === 'sent' && (
                <>
                  <i className="fas fa-check"
                    style={{ fontSize: '0.85rem' }} />
                  Message Sent!
                </>
              )}
              {status === 'error' && (
                <>
                  <i className="fas fa-exclamation-circle"
                    style={{ fontSize: '0.85rem' }} />
                  Try Again
                </>
              )}
            </button>

            {/* Fine print */}
            <p style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize:   '0.62rem',
              color:      '#444444',
              textAlign:  'center',
              margin:     0,
              lineHeight: 1.6,
            }}>
              Your information is never shared with anyone.
            </p>

          </form>
        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
          .form-row {
            grid-template-columns: 1fr !important;
          }
        }
        input::placeholder,
        textarea::placeholder {
          color: #333333;
          font-family: 'Inter', sans-serif;
        }
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 30px #111111 inset !important;
          -webkit-text-fill-color: #f5f5f5 !important;
        }
      `}</style>

    </section>
  );
}