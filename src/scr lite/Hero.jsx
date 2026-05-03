// src/components/sections/Hero.jsx
'use client';

import { useEffect, useRef, useState } from 'react';
import React from 'react';
import dynamic               from 'next/dynamic';
import { gsap }              from 'gsap';
import { SITE }              from '@/lib/constants';

// Full background particles — kept behind everything
const Scene = dynamic(
  () => import('@/components/three/Scene'),
  { ssr: false }
);

// Dedicated solar system canvas for the right column
const SolarSystem = dynamic(
  () => import('@/components/three/SolarSystem'),
  { ssr: false }
);

// ─── Scroll indicator ─────────────────────────────────
function ScrollIndicator() {
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    const onScroll = () => setVisible(window.scrollY < 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <a
      href="#about"
      aria-label="Scroll to about section"
      style={{
        position:       'fixed',
        bottom:         '40px',
        left:           '50%',
        transform:      'translateX(-50%)',
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        gap:            '8px',
        color:          '#888888',
        textDecoration: 'none',
        fontSize:       '0.7rem',
        fontFamily:     'JetBrains Mono, monospace',
        letterSpacing:  '0.15em',
        textTransform:  'uppercase',
        zIndex:         10,
        opacity:        visible ? 1 : 0,
        transition:     'opacity 0.4s ease',
        pointerEvents:  visible ? 'auto' : 'none',
      }}
    >
      <span>Scroll</span>
      <span style={{
        display:       'flex',
        flexDirection: 'column',
        alignItems:    'center',
        gap:           '2px',
        animation:     'float 2s ease-in-out infinite',
      }}>
        <span style={{
          width:      '1px',
          height:     '32px',
          background: 'linear-gradient(to bottom, transparent, #ffffff)',
        }} />
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
          <path
            d="M1 1L5 5L9 1"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </span>
    </a>
  );
}

// ─── Stat pill ────────────────────────────────────────
function StatPill({ value, label }) {
  return (
    <div style={{
      display:       'flex',
      flexDirection: 'column',
      alignItems:    'center',
      padding:       '12px 20px',
      background:    'rgba(255,255,255,0.03)',
      border:        '1px solid rgba(255,255,255,0.08)',
      borderRadius:  '12px',
      minWidth:      '90px',
    }}>
      <span style={{
        fontFamily: 'Syne, sans-serif',
        fontWeight: 700,
        fontSize:   '1.4rem',
        color:      '#ffffff',
        lineHeight: 1,
      }}>
        {value}
      </span>
      <span style={{
        fontFamily:    'JetBrains Mono, monospace',
        fontSize:      '0.65rem',
        color:         '#888888',
        marginTop:     '4px',
        textAlign:     'center',
        letterSpacing: '0.05em',
      }}>
        {label}
      </span>
    </div>
  );
}

// ─── Main Hero ────────────────────────────────────────
export default function Hero() {
  const containerRef = useRef(null);
  const labelRef     = useRef(null);
  const nameRef      = useRef(null);
  const roleRef      = useRef(null);
  const descRef      = useRef(null);
  const btnsRef      = useRef(null);
  const statsRef     = useRef(null);
  const rightRef     = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set(
        [
          labelRef.current,
          nameRef.current,
          roleRef.current,
          descRef.current,
          btnsRef.current,
          statsRef.current,
        ],
        { opacity: 0, y: 30 }
      );
      gsap.set(rightRef.current, { opacity: 0, x: 40 });

      const tl = gsap.timeline({ delay: 0.3 });

      tl.to(labelRef.current, {
        opacity: 1, y: 0, duration: 0.5, ease: 'power3.out',
      })
      .to(nameRef.current, {
        opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
      }, '-=0.3')
      .to(roleRef.current, {
        opacity: 1, y: 0, duration: 0.5, ease: 'power3.out',
      }, '-=0.3')
      .to(descRef.current, {
        opacity: 1, y: 0, duration: 0.5, ease: 'power3.out',
      }, '-=0.2')
      .to(btnsRef.current, {
        opacity: 1, y: 0, duration: 0.5, ease: 'power3.out',
      }, '-=0.2')
      .to(statsRef.current, {
        opacity: 1, y: 0, duration: 0.5, ease: 'power3.out',
      }, '-=0.2')
      .to(rightRef.current, {
        opacity: 1, x: 0, duration: 1.0, ease: 'power3.out',
      }, '-=0.5');

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="hero"
      style={{
        position:   'relative',
        minHeight:  '100vh',
        width:      '100%',
        overflow:   'hidden',
        display:    'flex',
        alignItems: 'center',
        background: '#080808',
      }}
    >

      {/* ── Subtle background particles — behind everything ── */}
      <div style={{
        position:      'absolute',
        inset:         0,
        zIndex:        0,
        pointerEvents: 'none',
        opacity:       0.25,       // ← dimmed so right column is clear
      }}>
        <Scene />
      </div>

      {/* ── Left side gradient — keeps text readable ── */}
      <div style={{
        position:      'absolute',
        top:           0,
        left:          0,
        width:         '55%',
        height:        '100%',
        zIndex:        1,
        background:    'linear-gradient(to right, rgba(8,8,8,1.0) 55%, rgba(8,8,8,0.85) 70%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* ── Bottom fade ── */}
      <div style={{
        position:      'absolute',
        bottom:        0,
        left:          0,
        right:         0,
        height:        '200px',
        zIndex:        2,
        background:    'linear-gradient(to bottom, transparent, #080808)',
        pointerEvents: 'none',
      }} />

      {/* ── Main content grid ── */}
      <div style={{
        position:            'relative',
        zIndex:              3,
        width:               '100%',
        paddingTop:          '100px',
        paddingBottom:       '100px',
        display:             'grid',
        gridTemplateColumns: '1fr 1fr',
        alignItems:          'center',
        gap:                 '0',
      }}>

        {/* ── Left — text — pointer events on ── */}
        <div style={{
          maxWidth:      '560px',
          pointerEvents: 'auto',
        }}>

          {/* Label */}
          <div ref={labelRef} style={{ marginBottom: '20px' }}>
            <span style={{
              fontFamily:    'JetBrains Mono, monospace',
              fontSize:      '0.75rem',
              color:         '#ffffff',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              display:       'inline-flex',
              alignItems:    'center',
              gap:           '8px',
            }}>
              <span style={{
                width:        '6px',
                height:       '6px',
                borderRadius: '50%',
                background:   '#ffffff',
                animation:    'pulseWhite 2s ease-in-out infinite',
                flexShrink:   0,
              }} />
              Available for opportunities
            </span>
          </div>

          {/* Name */}
          <h1
            ref={nameRef}
            style={{
              fontFamily:    'Syne, sans-serif',
              fontWeight:    800,
              fontSize:      'clamp(2.8rem, 6vw, 5rem)',
              lineHeight:    1.0,
              color:         '#f5f5f5',
              marginBottom:  '12px',
              letterSpacing: '-0.02em',
            }}
          >
            {SITE.name.split(' ')[0]}
            <br />
            <span style={{ color: '#ffffff' }}>
              {SITE.name.split(' ')[1]}
            </span>
          </h1>

          {/* Role */}
          <div ref={roleRef} style={{ marginBottom: '20px' }}>
            <span style={{
              fontFamily:    'JetBrains Mono, monospace',
              fontSize:      'clamp(0.85rem, 2vw, 1rem)',
              color:         '#888888',
              letterSpacing: '0.08em',
            }}>
              {SITE.role} · {SITE.location}
            </span>
          </div>

          {/* Description */}
          <p
            ref={descRef}
            style={{
              fontFamily:   'Inter, sans-serif',
              fontSize:     'clamp(0.95rem, 2vw, 1.05rem)',
              color:        '#888888',
              lineHeight:   1.75,
              marginBottom: '36px',
              maxWidth:     '480px',
            }}
          >
            Aspiring software engineer passionate about ML, GenAI,
            and building products that solve real problems.
            Currently based in Indore, India.
          </p>

          {/* CTA Buttons */}
          <div
            ref={btnsRef}
            style={{
              display:      'flex',
              gap:          '12px',
              flexWrap:     'wrap',
              marginBottom: '48px',
            }}
          >
            <a href="#projects" className="btn-primary">
              View Projects
              <svg width="14" height="14" viewBox="0 0 24 24"
                fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round">
                <line x1="7" y1="17" x2="17" y2="7"/>
                <polyline points="7 7 17 7 17 17"/>
              </svg>
            </a>
            <a href={SITE.resume} download className="btn-ghost">
              Download Resume
              <svg width="14" height="14" viewBox="0 0 24 24"
                fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
            </a>
          </div>

          {/* Stats */}
          <div
            ref={statsRef}
            style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}
          >
            <StatPill value="2+"  label="Years Learning" />
            <StatPill value="5+"  label="Projects Built" />
            <StatPill value="2"   label="Internships"    />
            <StatPill value="6+"  label="Certificates"   />
          </div>

        </div>
        {/* ── end left ── */}

        {/* ── Right — solar system (absolutely positioned so it never pushes section height) ── */}
        <div
          ref={rightRef}
          style={{
            position:      'absolute',
            top:           '-5%',
            right:         '-8%',
            width:         '62%',
            height:        '110%',
            display:       'none',
            pointerEvents: 'auto',
          }}
          className="hero-right"
        >
          <SolarSystem />

          {/* Drag hint badge */}
          <div style={{
            position:      'absolute',
            bottom:        '120px',
            left:          '50%',
            transform:     'translateX(-50%)',
            padding:       '6px 14px',
            background:    'rgba(8,8,8,0.6)',
            backdropFilter:'blur(8px)',
            border:        '1px solid rgba(255,255,255,0.06)',
            borderRadius:  '20px',
            pointerEvents: 'none',
            animation:     'fadeIn 1s ease 3s both',
          }}>
            <span style={{
              fontFamily:    'JetBrains Mono, monospace',
              fontSize:      '0.58rem',
              color:         'rgba(255,255,255,0.3)',
              letterSpacing: '0.1em',
              whiteSpace:    'nowrap',
            }}>
              drag to explore
            </span>
          </div>
        </div>
        {/* ── end right ── */}

      </div>
      {/* ── end grid ── */}

      <ScrollIndicator />

      <style>{`
        @media (min-width: 768px) {
          .hero-right { display: block !important; }
        }
        @media (max-width: 767px) {
          .hero-right { display: none !important; }
        }
      `}</style>

    </section>
  );
}