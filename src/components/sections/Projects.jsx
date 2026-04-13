// src/components/sections/Projects.jsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useGSAPScrollReveal }         from '@/hooks/useGSAP';
import projects                        from '@/data/projects';
import gsap                            from 'gsap';

const TAB_HEIGHT   = 48;
const STACK_OFFSET = 48;  // visible gap between stacked tabs
const FOLDER_BODY  = 320; // height of expanded folder body

function Folder({ project, index, total, isActive, onClick }) {
  const folderRef = useRef(null);
  const bodyRef   = useRef(null);
  const prevActive = useRef(false);

  // bottom position in the stack (index 0 = lowest tab)
  const stackBottom = index * STACK_OFFSET;

  useEffect(() => {
    if (!folderRef.current || !bodyRef.current) return;

    if (isActive) {
      // Lift smoothly — no elastic bounce, just a clean power curve
      gsap.to(folderRef.current, {
        y:        -(FOLDER_BODY + (total - 1 - index) * STACK_OFFSET),
        duration: 0.45,
        ease:     'power3.out',
      });
      gsap.to(bodyRef.current, {
        opacity:      1,
        pointerEvents:'auto',
        duration:     0.25,
        delay:        0.2,
        ease:         'power2.out',
      });
    } else {
      gsap.to(folderRef.current, {
        y:        0,
        duration: prevActive.current ? 0.35 : 0,
        ease:     'power3.inOut',
      });
      gsap.to(bodyRef.current, {
        opacity:      0,
        pointerEvents:'none',
        duration:     0.15,
        ease:         'power2.in',
      });
    }
    prevActive.current = isActive;
  }, [isActive, index, total]);

  return (
    <div
      ref={folderRef}
      style={{
        position:   'absolute',
        bottom:     `${stackBottom}px`,
        left:       0,
        right:      0,
        zIndex:     isActive ? 50 : index + 1,
        willChange: 'transform',
      }}
    >
      {/* ── Tab ── */}
      <div
        onClick={onClick}
        style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          padding:        '0 24px',
          height:         `${TAB_HEIGHT}px`,
          background:     isActive ? '#181818' : '#111111',
          borderTop:      `1px solid ${isActive ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.08)'}`,
          borderLeft:     '1px solid rgba(255,255,255,0.06)',
          borderRight:    '1px solid rgba(255,255,255,0.06)',
          borderRadius:   '8px 8px 0 0',
          cursor:         'pointer',
          transition:     'background 0.2s ease',
          userSelect:     'none',
        }}
      >
        {/* Left */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', overflow: 'hidden' }}>
          <span style={{
            fontFamily:    'JetBrains Mono, monospace',
            fontSize:      '0.58rem',
            color:         isActive ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.15)',
            letterSpacing: '0.12em',
            flexShrink:    0,
          }}>
            {String(index + 1).padStart(2, '0')}
          </span>
          <span style={{
            fontFamily:   'Syne, sans-serif',
            fontWeight:   700,
            fontSize:     '0.8rem',
            color:        isActive ? '#f0f0f0' : '#555555',
            whiteSpace:   'nowrap',
            overflow:     'hidden',
            textOverflow: 'ellipsis',
            transition:   'color 0.2s ease',
          }}>
            {project.title}
          </span>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          {project.featured && (
            <span style={{
              fontFamily:    'JetBrains Mono, monospace',
              fontSize:      '0.52rem',
              color:         isActive ? 'rgba(255,255,255,0.6)' : '#333333',
              border:        `1px solid ${isActive ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)'}`,
              borderRadius:  '3px',
              padding:       '2px 6px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              transition:    'all 0.2s ease',
            }}>
              Featured
            </span>
          )}
          <span style={{
            fontFamily:    'JetBrains Mono, monospace',
            fontSize:      '0.58rem',
            color:         isActive ? 'rgba(255,255,255,0.4)' : '#333333',
            letterSpacing: '0.05em',
            transition:    'color 0.2s ease',
          }}>
            {project.category}
          </span>
          <span style={{
            fontSize:   '0.65rem',
            color:      isActive ? 'rgba(255,255,255,0.7)' : '#2a2a2a',
            transition: 'transform 0.3s ease, color 0.2s ease',
            transform:  isActive ? 'rotate(180deg)' : 'rotate(0deg)',
            display:    'inline-block',
            lineHeight: 1,
          }}>
            ↑
          </span>
        </div>
      </div>

      {/* ── Body ── */}
      <div
        ref={bodyRef}
        style={{
          opacity:      0,
          pointerEvents:'none',
          background:   '#111111',
          border:       '1px solid rgba(255,255,255,0.06)',
          borderTop:    'none',
          borderRadius: '0 0 10px 10px',
          padding:      '28px 28px 24px',
          boxShadow:    '0 24px 60px rgba(0,0,0,0.7)',
        }}
      >
        <div className="folder-grid" style={{
          display:             'grid',
          gridTemplateColumns: '1fr 340px',
          gap:                 '28px',
          alignItems:          'start',
        }}>

          {/* Left */}
          <div>
            <span style={{
              fontFamily:    'JetBrains Mono, monospace',
              fontSize:      '0.6rem',
              color:         '#444444',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              display:       'block',
              marginBottom:  '8px',
            }}>
              // {project.category}
            </span>

            <h3 style={{
              fontFamily:   'Syne, sans-serif',
              fontWeight:   800,
              fontSize:     'clamp(1rem, 2vw, 1.3rem)',
              color:        '#eeeeee',
              lineHeight:   1.25,
              marginBottom: '12px',
            }}>
              {project.title}
            </h3>

            <p style={{
              fontFamily:   'Inter, sans-serif',
              fontSize:     '0.875rem',
              color:        '#666666',
              lineHeight:   1.8,
              marginBottom: '20px',
              maxWidth:     '520px',
            }}>
              {project.description}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '24px' }}>
              {project.techStack.map(tech => (
                <span key={tech} style={{
                  fontFamily:   'JetBrains Mono, monospace',
                  fontSize:     '0.62rem',
                  padding:      '3px 9px',
                  borderRadius: '4px',
                  background:   '#161616',
                  color:        '#777777',
                  border:       '1px solid rgba(255,255,255,0.06)',
                }}>
                  {tech}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              {project.githubUrl && project.githubUrl !== '#' ? (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost"
                  style={{ padding: '8px 18px', fontSize: '0.75rem' }}
                  onClick={e => e.stopPropagation()}
                >
                  <i className="fab fa-github" style={{ fontSize: '0.8rem' }} />
                  GitHub
                </a>
              ) : (
                <span style={{
                  padding:    '8px 16px',
                  fontSize:   '0.7rem',
                  color:      '#2e2e2e',
                  fontFamily: 'JetBrains Mono, monospace',
                  border:     '1px solid rgba(255,255,255,0.04)',
                  borderRadius:'7px',
                }}>
                  Private Repo
                </span>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ padding: '8px 18px', fontSize: '0.75rem' }}
                  onClick={e => e.stopPropagation()}
                >
                  <i className="fas fa-external-link-alt" style={{ fontSize: '0.75rem' }} />
                  Live Demo
                </a>
              )}
            </div>
          </div>

          {/* Right — image */}
          <div style={{
            borderRadius: '8px',
            overflow:     'hidden',
            border:       '1px solid rgba(255,255,255,0.05)',
            aspectRatio:  '16/10',
            background:   '#0c0c0c',
            position:     'relative',
          }}>
            {project.image ? (
              <img
                src={project.image}
                alt={project.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7, display: 'block' }}
              />
            ) : (
              <div style={{
                width:           '100%',
                height:          '100%',
                backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
                backgroundSize:  '20px 20px',
                display:         'flex',
                alignItems:      'center',
                justifyContent:  'center',
              }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.6rem', color: '#222222', letterSpacing: '0.1em' }}>
                  {project.category.toUpperCase()}
                </span>
              </div>
            )}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(8,8,8,0.25) 0%, transparent 60%)' }} />
          </div>

        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────
export default function Projects() {
  const [activeId, setActiveId] = useState(null);
  const headerRef               = useGSAPScrollReveal({ y: 30, duration: 0.6 });
  const wrapperRef              = useRef(null);

  // Collapsed height = all tabs stacked + one tab height
  const collapsedHeight = (projects.length - 1) * STACK_OFFSET + TAB_HEIGHT;
  // Expanded height = collapsed + folder body + some breathing room
  const expandedHeight  = collapsedHeight + FOLDER_BODY + 40;

  // Animate section height on open/close
  useEffect(() => {
    if (!wrapperRef.current) return;
    gsap.to(wrapperRef.current, {
      height:   activeId ? expandedHeight : collapsedHeight,
      duration: 0.4,
      ease:     'power3.inOut',
    });
  }, [activeId, collapsedHeight, expandedHeight]);

  return (
    <section id="projects" className="section-wrapper">

      <div ref={headerRef} style={{ marginBottom: '48px' }}>
        <span className="section-label">// what i've built</span>
        <h2 className="section-heading">Projects</h2>
        <div className="gold-line" />
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize:   '0.9rem',
          color:      '#444444',
          marginTop:  '14px',
          lineHeight: 1.7,
        }}>
          Select a folder to open the project.
        </p>
      </div>

      {/* Dynamic height wrapper */}
      <div
        ref={wrapperRef}
        style={{
          position: 'relative',
          height:   `${collapsedHeight}px`,
          overflow: 'visible',
        }}
      >
        {projects.map((project, index) => (
          <Folder
            key={project.id}
            project={project}
            index={index}
            total={projects.length}
            isActive={activeId === project.id}
            onClick={() => setActiveId(prev => prev === project.id ? null : project.id)}
          />
        ))}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .folder-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

    </section>
  );
}