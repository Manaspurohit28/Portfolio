// src/components/sections/Experience.jsx
'use client';

import { useState }              from 'react';
import { useGSAPStaggerReveal }  from '@/hooks/useGSAP';
import experience                from '@/data/experience';
import education                 from '@/data/education';

// ─── Work Card ────────────────────────────────────────
function WorkCard({ job }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="stagger-item"
      style={{
        display:    'flex',
        gap:        '20px',
        alignItems: 'flex-start',
        width:      '100%',
      }}
    >
      {/* Timeline dot + line */}
      <div style={{
        display:       'flex',
        flexDirection: 'column',
        alignItems:    'center',
        flexShrink:    0,
        paddingTop:    '6px',
      }}>
        <div style={{
          width:        '12px',
          height:       '12px',
          borderRadius: '50%',
          background:   '#ffffff',
          border:       '2px solid #080808',
          boxShadow:    '0 0 0 3px rgba(255, 255, 255, 0.2)',
          flexShrink:   0,
        }} />
        <div style={{
          width:      '1px',
          flex:       1,
          minHeight:  '40px',
          background: 'rgba(255,255,255,0.06)',
          marginTop:  '8px',
        }} />
      </div>

      {/* Card */}
      <div style={{ flex: 1, paddingBottom: '40px' }}>

        {/* Period + location */}
        <div style={{
          display:      'flex',
          alignItems:   'center',
          gap:          '10px',
          marginBottom: '10px',
          flexWrap:     'wrap',
        }}>
          <span style={{
            fontFamily:    'JetBrains Mono, monospace',
            fontSize:      '0.68rem',
            color:         '#ffffff',
            letterSpacing: '0.08em',
          }}>
            {job.period}
          </span>
          <span style={{
            width:        '3px',
            height:       '3px',
            borderRadius: '50%',
            background:   '#444444',
            flexShrink:   0,
          }} />
          <span style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize:   '0.65rem',
            color:      '#444444',
          }}>
            📍 {job.location}
          </span>
        </div>

        {/* Main card — gold left border accent instead of initials badge */}
        <div
          style={{
            background:   '#111111',
            border:       '1px solid rgba(255,255,255,0.05)',
            borderRadius: '14px',
            borderLeft:   `3px solid ${job.color || '#ffffff'}`, // ← accent
            padding:      '24px',
            width:        '100%',
            transition:   'border-color 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor       = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.borderLeftColor   = job.color || '#ffffff';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor       = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.borderLeftColor   = job.color || '#ffffff';
          }}
        >

          {/* Header — role + company, no badge */}
          <div style={{ marginBottom: '12px' }}>
            <h3 style={{
              fontFamily: 'Syne, sans-serif',
              fontSize:   '1.05rem',
              fontWeight: 700,
              color:      '#f5f5f5',
              margin:     '0 0 4px',
            }}>
              {job.role}
            </h3>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize:   '0.875rem',
              color:      job.color || '#ffffff',
              margin:     0,
              opacity:    0.9,
            }}>
              {job.company}
            </p>
          </div>

          {/* Description */}
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize:   '0.875rem',
            color:      '#888888',
            lineHeight: 1.75,
            margin:     '0 0 16px',
          }}>
            {job.description}
          </p>

          {/* Expandable bullet points */}
          <div style={{
            overflow:   'hidden',
            maxHeight:  expanded ? '400px' : '0px',
            transition: 'max-height 0.35s ease',
          }}>
            <ul style={{
              listStyle:     'none',
              padding:       '0 0 16px',
              margin:        0,
              display:       'flex',
              flexDirection: 'column',
              gap:           '8px',
            }}>
              {job.points.map((point, i) => (
                <li key={i} style={{
                  display:    'flex',
                  gap:        '10px',
                  alignItems: 'flex-start',
                }}>
                  <span style={{
                    color:      job.color || '#ffffff',
                    flexShrink: 0,
                    marginTop:  '2px',
                    fontSize:   '0.85rem',
                  }}>
                    ›
                  </span>
                  <span style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize:   '0.82rem',
                    color:      '#888888',
                    lineHeight: 1.65,
                  }}>
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer — tech badges + toggle */}
          <div style={{
            display:        'flex',
            justifyContent: 'space-between',
            alignItems:     'center',
            flexWrap:       'wrap',
            gap:            '12px',
            marginTop:      '4px',
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {job.techStack.map(tech => (
                <span key={tech} className="tech-badge">{tech}</span>
              ))}
            </div>

            <button
              onClick={() => setExpanded(p => !p)}
              style={{
                background: 'transparent',
                border:     'none',
                cursor:     'pointer',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize:   '0.68rem',
                color:      '#ffffff',
                display:    'flex',
                alignItems: 'center',
                gap:        '4px',
                padding:    '4px 0',
                opacity:    0.8,
                transition: 'opacity 0.2s ease',
                flexShrink: 0,
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '1'}
              onMouseLeave={e => e.currentTarget.style.opacity = '0.8'}
            >
              {expanded ? 'Show less' : 'Show details'}
              <span style={{
                display:    'inline-block',
                transition: 'transform 0.3s ease',
                transform:  expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              }}>
                ↓
              </span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── Education Card ───────────────────────────────────
function EduCard({ edu }) {
  return (
    <div
      className="stagger-item"
      style={{
        display:    'flex',
        gap:        '20px',
        alignItems: 'flex-start',
        width:      '100%',
      }}
    >
      {/* Timeline dot + line */}
      <div style={{
        display:       'flex',
        flexDirection: 'column',
        alignItems:    'center',
        flexShrink:    0,
        paddingTop:    '6px',
      }}>
        <div style={{
          width:        '10px',
          height:       '10px',
          borderRadius: '50%',
          background:   'transparent',
          border:       '2px solid rgba(255, 255, 255, 0.4)',
          flexShrink:   0,
        }} />
        <div style={{
          width:      '1px',
          flex:       1,
          minHeight:  '20px',
          background: 'rgba(255,255,255,0.04)',
          marginTop:  '8px',
        }} />
      </div>

      {/* Card */}
      <div style={{ flex: 1, paddingBottom: '28px' }}>
        <div
          style={{
            background:    '#111111',
            border:        '1px solid rgba(255,255,255,0.05)',
            borderRadius:  '12px',
            borderLeft:    '3px solid rgba(255, 255, 255, 0.3)',  // ← subtle accent
            padding:       '20px 24px',
            width:         '100%',
            display:       'flex',
            justifyContent:'space-between',
            alignItems:    'flex-start',
            gap:           '16px',
            flexWrap:      'wrap',
            transition:    'border-color 0.2s ease',
          }}
          onMouseEnter={e =>
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'}
          onMouseLeave={e =>
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)'}
        >
          <div style={{ flex: 1 }}>
            <p style={{
              fontFamily: 'Syne, sans-serif',
              fontSize:   '0.95rem',
              fontWeight: 700,
              color:      '#f5f5f5',
              margin:     '0 0 4px',
              lineHeight: 1.3,
            }}>
              {edu.institution}
            </p>
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize:   '0.82rem',
              color:      '#888888',
              margin:     '0 0 10px',
            }}>
              {edu.degree}
            </p>
            <span style={{
              fontFamily:  'JetBrains Mono, monospace',
              fontSize:    '0.68rem',
              color:       '#ffffff',
              opacity:     0.75,
              padding:     '3px 8px',
              background:  'rgba(255, 255, 255, 0.06)',
              borderRadius:'5px',
              border:      '1px solid rgba(255, 255, 255, 0.12)',
            }}>
              {edu.score}
            </span>
          </div>

          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <span style={{
              fontFamily:    'JetBrains Mono, monospace',
              fontSize:      '0.68rem',
              color:         '#ffffff',
              letterSpacing: '0.05em',
              display:       'block',
            }}>
              {edu.period}
            </span>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize:   '0.62rem',
              color:      '#444444',
              marginTop:  '4px',
              display:    'block',
            }}>
              📍 {edu.location}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sub header ───────────────────────────────────────
function SubHeader({ emoji, title }) {
  return (
    <div style={{
      display:      'flex',
      alignItems:   'center',
      gap:          '12px',
      marginBottom: '32px',
    }}>
      <div style={{
        width:          '32px',
        height:         '32px',
        borderRadius:   '8px',
        background:     'rgba(255, 255, 255, 0.08)',
        border:         '1px solid rgba(255, 255, 255, 0.15)',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        fontSize:       '0.85rem',
        flexShrink:     0,
      }}>
        {emoji}
      </div>
      <h3 style={{
        fontFamily: 'Syne, sans-serif',
        fontSize:   '1.1rem',
        fontWeight: 700,
        color:      '#f5f5f5',
        margin:     0,
      }}>
        {title}
      </h3>
      <div style={{
        flex:       1,
        height:     '1px',
        background: 'rgba(255,255,255,0.05)',
      }} />
    </div>
  );
}

// ─── Main section ─────────────────────────────────────
export default function Experience() {
  const workRef = useGSAPStaggerReveal({ stagger: 0.12 });
  const eduRef  = useGSAPStaggerReveal({ stagger: 0.1  });

  return (
    <section id="experience" className="section-wrapper">

      <div style={{ marginBottom: '64px' }}>
        <span className="section-label">// where i've worked</span>
        <h2 className="section-heading">Experience</h2>
        <div className="gold-line" />
      </div>

      {/* Work — full width */}
      <div style={{ marginBottom: '72px' }}>
        <SubHeader emoji="💼" title="Work Experience" />
        <div ref={workRef} style={{ width: '100%' }}>
          {experience.map(job => (
            <WorkCard key={job.id} job={job} />
          ))}
        </div>
      </div>

      {/* Education — full width */}
      <div>
        <SubHeader emoji="🎓" title="Education" />
        <div ref={eduRef} style={{ width: '100%' }}>
          {education.map(edu => (
            <EduCard key={edu.id} edu={edu} />
          ))}
        </div>
      </div>

    </section>
  );
}