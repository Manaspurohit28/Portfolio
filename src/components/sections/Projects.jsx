// src/components/sections/Projects.jsx
'use client';

import Image                       from 'next/image';
import { useState }                from 'react';
import { useGSAPStaggerReveal }    from '@/hooks/useGSAP';
import projects                    from '@/data/projects';

// ─── Single project card ──────────────────────────────
function ProjectCard({ project }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="stagger-item"
      style={{
        background:    '#111111',
        border:        `1px solid ${hovered
          ? 'rgba(255, 255, 255, 0.2)'
          : 'rgba(255,255,255,0.05)'}`,
        borderRadius:  '16px',
        overflow:      'hidden',
        transition:    'all 0.3s ease',
        transform:     hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow:     hovered
          ? '0 20px 40px rgba(0,0,0,0.5)'
          : '0 2px 8px rgba(0,0,0,0.3)',
        display:       'flex',
        flexDirection: 'column',
      }}
    >
      {/* Image area */}
      <div style={{
        position:   'relative',
        height:     '200px',
        overflow:   'hidden',
        background: '#1a1a1a',
        flexShrink: 0,
      }}>
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            style={{
              objectFit:  'cover',
              transition: 'transform 0.5s ease',
              transform:  hovered ? 'scale(1.05)' : 'scale(1)',
            }}
          />
        ) : (
          /* Placeholder when no image */
          <div style={{
            width:          '100%',
            height:         '100%',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            background:     'linear-gradient(135deg, #111111, #1a1a1a)',
          }}>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize:   '0.7rem',
              color:      '#333333',
              letterSpacing: '0.1em',
            }}>
              {project.category}
            </span>
          </div>
        )}

        {/* Category badge on image */}
        <div style={{
          position:     'absolute',
          top:          '12px',
          left:         '12px',
          padding:      '4px 10px',
          background:   'rgba(8,8,8,0.8)',
          backdropFilter: 'blur(8px)',
          borderRadius: '6px',
          border:       '1px solid rgba(255,255,255,0.08)',
        }}>
          <span style={{
            fontFamily:  'JetBrains Mono, monospace',
            fontSize:    '0.62rem',
            color:       '#ffffff',
            letterSpacing:'0.1em',
          }}>
            {project.category}
          </span>
        </div>

        {/* Featured badge */}
        {project.featured && (
          <div style={{
            position:     'absolute',
            top:          '12px',
            right:        '12px',
            padding:      '4px 10px',
            background:   'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(8px)',
            borderRadius: '6px',
            border:       '1px solid rgba(255, 255, 255, 0.3)',
          }}>
            <span style={{
              fontFamily:  'JetBrains Mono, monospace',
              fontSize:    '0.62rem',
              color:       '#ffffff',
            }}>
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{
        padding:       '24px',
        display:       'flex',
        flexDirection: 'column',
        flex:          1,
      }}>
        <h3 style={{
          fontFamily:   'Syne, sans-serif',
          fontSize:     '1.05rem',
          fontWeight:   700,
          color:        '#f5f5f5',
          marginBottom: '10px',
          lineHeight:   1.3,
        }}>
          {project.title}
        </h3>

        <p style={{
          fontFamily:   'Inter, sans-serif',
          fontSize:     '0.875rem',
          color:        '#888888',
          lineHeight:   1.7,
          marginBottom: '20px',
          flex:         1,
        }}>
          {project.description}
        </p>

        {/* Tech stack */}
        <div style={{
          display:      'flex',
          flexWrap:     'wrap',
          gap:          '6px',
          marginBottom: '20px',
        }}>
          {project.techStack.map(tech => (
            <span key={tech} className="tech-badge">{tech}</span>
          ))}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          {project.githubUrl && project.githubUrl !== '#' && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
              style={{ padding: '8px 16px', fontSize: '0.78rem', flex: 1,
                justifyContent: 'center' }}
            >
              <i className="fab fa-github" />
              GitHub
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.78rem', flex: 1,
                justifyContent: 'center' }}
            >
              <i className="fas fa-external-link-alt" />
              Live Demo
            </a>
          )}
          {!project.liveUrl && (!project.githubUrl || project.githubUrl === '#') && (
            <div style={{
              padding:      '8px 16px',
              fontSize:     '0.72rem',
              color:        '#444444',
              fontFamily:   'JetBrains Mono, monospace',
              border:       '1px solid rgba(255,255,255,0.04)',
              borderRadius: '8px',
              flex:         1,
              textAlign:    'center',
            }}>
              Private Repository
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// ─── Main Projects section ────────────────────────────
export default function Projects() {
  const gridRef = useGSAPStaggerReveal({ stagger: 0.1 });

  return (
    <section id="projects" className="section-wrapper">

      <div style={{ marginBottom: '64px' }}>
        <span className="section-label">// what i've built</span>
        <h2 className="section-heading">Projects</h2>
        <div className="gold-line" />
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize:   '1rem',
          color:      '#888888',
          marginTop:  '16px',
          maxWidth:   '480px',
          lineHeight: 1.7,
        }}>
          A selection of things I've built — from ML models to full-stack tools.
        </p>
      </div>

      <div
        ref={gridRef}
        style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap:                 '24px',
        }}
        className="projects-grid"
      >
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .projects-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 640px) {
          .projects-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

    </section>
  );
}