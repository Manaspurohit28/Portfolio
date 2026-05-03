'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useGSAPScrollReveal } from '@/hooks/useGSAP';

// ─── Project Data ─────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    id: 'MSN-001',
    title: 'BloomNet',
    subtitle: 'Flower Classification System',
    description:
      'A deep learning system that identifies flower species from images using CNN architecture and OpenCV for preprocessing.',
    tags: ['Python', 'TensorFlow', 'CNN', 'OpenCV', 'NumPy'],
    category: 'Machine Learning',
    color: '#60a5fa',
    rgb: '96,165,250',
    githubUrl: 'https://github.com/Manaspurohit28/Flower_Classification_System',
    liveUrl: null,
  },
  {
    id: 'MSN-002',
    title: 'House Price Prediction',
    subtitle: 'Bangalore Real Estate Model',
    description:
      'ML tool estimating Bangalore property prices based on location, size, and amenities with a Flask web interface.',
    tags: ['Python', 'Scikit-learn', 'Flask', 'Pandas', 'NumPy'],
    category: 'Machine Learning',
    color: '#f97316',
    rgb: '249,115,22',
    githubUrl: '#',
    liveUrl: null,
  },
  {
    id: 'MSN-003',
    title: 'RAG Evaluation System',
    subtitle: 'GenAI QA Pipeline Assessor',
    description:
      'DeepEval-based evaluation software for GenAI QA systems built during TCS internship. Assesses RAG pipeline quality metrics.',
    tags: ['Python', 'DeepEval', 'LangChain', 'LLM', 'RAG'],
    category: 'GenAI',
    color: '#a78bfa',
    rgb: '167,139,250',
    githubUrl: '#',
    liveUrl: null,
  },
  {
    id: 'MSN-004',
    title: 'Resume Ranking System',
    subtitle: 'Automated Candidate Matcher',
    description:
      'Automated resume ranking using local LLM and FAISS embeddings to match candidates against job descriptions with accuracy.',
    tags: ['Python', 'FAISS', 'Embeddings', 'LLM', 'NLP'],
    category: 'GenAI',
    color: '#4ade80',
    rgb: '74,222,128',
    githubUrl: '#',
    liveUrl: null,
  },
  {
    id: 'MSN-005',
    title: 'Retail Sales Forecast',
    subtitle: 'XGBoost Demand Predictor',
    description:
      'XGBoost-powered forecasting model built at AllSoft. Uses sales history, holidays, and oil price data for retail predictions.',
    tags: ['Python', 'XGBoost', 'Pandas', 'Feature Eng.', 'Matplotlib'],
    category: 'Machine Learning',
    color: '#fbbf24',
    rgb: '251,191,36',
    githubUrl: '#',
    liveUrl: null,
  },
];

// ─── Orbit Configuration ──────────────────────────────────────────────────────
// rx/ry define the ellipse radii; speed is radians per ms
// Inner orbits are faster (higher speed value)
const ORBIT_CONFIG = [
  { rx: 0.28, ry: 0.115, speed: 0.00042, startAngle: Math.PI * 0.80 },
  { rx: 0.38, ry: 0.160, speed: 0.00030, startAngle: Math.PI * 0.77 },
  { rx: 0.49, ry: 0.210, speed: 0.00021, startAngle: Math.PI * 0.74 },
  { rx: 0.60, ry: 0.262, speed: 0.00014, startAngle: Math.PI * 0.71 },
  { rx: 0.71, ry: 0.315, speed: 0.00009, startAngle: Math.PI * 0.68 },
];

// Arc sweep: only the visible left hemisphere portion of each orbit
const ARC_START = Math.PI * 0.28;
const ARC_END   = Math.PI * 1.72;

// ─── Canvas Renderer ──────────────────────────────────────────────────────────
function useOrbitCanvas({ containerRef, onHoverChange, locked }) {
  const canvasRef   = useRef(null);
  const stateRef    = useRef({
    angles:     ORBIT_CONFIG.map(o => o.startAngle),
    hovered:    -1,
    paused:     false,
    stars:      null,
    lastTs:     null,
    raf:        null,
    W: 0, H: 0,
    sunX: 0, sunY: 0, sunR: 0,
  });

  // Sync locked state into the render loop ref
  const lockedRef = useRef(locked);
  useEffect(() => { lockedRef.current = locked; }, [locked]);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const getSunParams = (W, H) => ({
    x: W + W * 0.045,
    y: H * 0.5,
    r: H * 0.54,
  });

  const getOrbit = (i, W, H) => {
    const o = ORBIT_CONFIG[i];
    return { rx: o.rx * W, ry: o.ry * H };
  };

  const getPlanetPos = (i, angle, W, H) => {
    const sun = getSunParams(W, H);
    const o   = getOrbit(i, W, H);
    return {
      x: sun.x + o.rx * Math.cos(angle),
      y: sun.y + o.ry * Math.sin(angle),
    };
  };

  // ── Draw functions ─────────────────────────────────────────────────────────
  const buildStars = (W, H) =>
    Array.from({ length: 110 }, () => ({
      x: Math.random() * W * 0.70,
      y: Math.random() * H,
      r: Math.random() * 1.3 + 0.2,
      a: Math.random() * 0.55 + 0.1,
      p: Math.random() * Math.PI * 2,
      sp: (Math.random() * 0.4 + 0.2) * 0.001,
    }));

  const drawStars = (ctx, stars, ts) => {
    stars.forEach(s => {
      const alpha = s.a * (0.6 + 0.4 * Math.sin(ts * s.sp + s.p));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fill();
    });
  };

  const drawSun = (ctx, sunX, sunY, sunR) => {
    // Outer corona glow
    const corona = ctx.createRadialGradient(sunX, sunY, sunR * 0.4, sunX, sunY, sunR);
    corona.addColorStop(0,   'rgba(255,200,80,0.22)');
    corona.addColorStop(0.4, 'rgba(255,130,30,0.14)');
    corona.addColorStop(0.75,'rgba(255,60,10,0.06)');
    corona.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
    ctx.fillStyle = corona;
    ctx.fill();

    // Inner surface
    const surface = ctx.createRadialGradient(
      sunX - sunR * 0.12, sunY - sunR * 0.12, 0,
      sunX, sunY, sunR * 0.42
    );
    surface.addColorStop(0,   'rgba(255,255,220,1)');
    surface.addColorStop(0.35,'rgba(255,210,80,0.95)');
    surface.addColorStop(0.7, 'rgba(255,150,40,0.7)');
    surface.addColorStop(1,   'rgba(255,80,10,0)');
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
    ctx.fillStyle = surface;
    ctx.fill();
  };

  const drawOrbitArc = (ctx, i, hovered, W, H) => {
    const sun   = getSunParams(W, H);
    const o     = getOrbit(i, W, H);
    const proj  = PROJECTS[i];
    const isHov = hovered === i;
    const steps = 260;

    ctx.beginPath();
    let first = true;
    for (let s = 0; s <= steps; s++) {
      const angle = ARC_START + (ARC_END - ARC_START) * (s / steps);
      const px = sun.x + o.rx * Math.cos(angle);
      const py = sun.y + o.ry * Math.sin(angle);
      if (px > W + 30) continue;
      if (first) { ctx.moveTo(px, py); first = false; }
      else ctx.lineTo(px, py);
    }

    ctx.strokeStyle = isHov
      ? `rgba(${proj.rgb},0.40)`
      : 'rgba(255,255,255,0.06)';
    ctx.lineWidth = isHov ? 1.4 : 0.7;
    ctx.setLineDash([5, 10]);
    ctx.stroke();
    ctx.setLineDash([]);
  };

  const drawPlanet = (ctx, i, angle, hovered, W, H) => {
    const pos  = getPlanetPos(i, angle, W, H);
    if (pos.x > W + 24 || pos.x < -24) return;

    const proj  = PROJECTS[i];
    const isHov = hovered === i;
    const pr    = isHov ? 11 : 7.5;

    // Glow halo
    const glowR = pr * (isHov ? 4.5 : 3.2);
    const glow  = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, glowR);
    glow.addColorStop(0,   `rgba(${proj.rgb},${isHov ? 0.55 : 0.28})`);
    glow.addColorStop(0.5, `rgba(${proj.rgb},${isHov ? 0.18 : 0.08})`);
    glow.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, glowR, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();

    // Planet body
    const body = ctx.createRadialGradient(
      pos.x - pr * 0.32, pos.y - pr * 0.32, pr * 0.05,
      pos.x, pos.y, pr
    );
    body.addColorStop(0,   '#ffffff');
    body.addColorStop(0.3, proj.color);
    body.addColorStop(1,   `rgba(${proj.rgb},0.45)`);
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, pr, 0, Math.PI * 2);
    ctx.fillStyle = body;
    ctx.fill();

    // Hover ring
    if (isHov) {
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, pr + 5, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${proj.rgb},0.55)`;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Outer pulse ring
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, pr + 11, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${proj.rgb},0.18)`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }
  };

  // ── Hit testing ────────────────────────────────────────────────────────────
  const hitTest = useCallback((mx, my, W, H, angles) => {
    for (let i = 0; i < PROJECTS.length; i++) {
      const pos = getPlanetPos(i, angles[i], W, H);
      const dx  = mx - pos.x;
      const dy  = my - pos.y;
      if (Math.sqrt(dx * dx + dy * dy) < 20) return i;
    }
    return -1;
  }, []);

  // ── Main render loop ───────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx    = canvas.getContext('2d');
    const s      = stateRef.current;

    const resize = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      s.W = canvas.width  = rect?.width  || 900;
      s.H = canvas.height = rect?.height || 520;
      s.stars = null; // rebuild on next frame
    };

    const loop = (ts) => {
      if (!s.lastTs) s.lastTs = ts;
      const dt = Math.min(ts - s.lastTs, 50); // cap delta to avoid jumps
      s.lastTs = ts;

      const { W, H } = s;
      if (!W || !H) { s.raf = requestAnimationFrame(loop); return; }

      ctx.clearRect(0, 0, W, H);

      // Stars
      if (!s.stars) s.stars = buildStars(W, H);
      drawStars(ctx, s.stars, ts);

      // Sun
      const sun = getSunParams(W, H);
      drawSun(ctx, sun.x, sun.y, sun.r);

      // Arcs (draw before planets so planets sit on top)
      for (let i = 0; i < PROJECTS.length; i++) drawOrbitArc(ctx, i, s.hovered, W, H);

      // Advance angles — freeze when hovered OR card is locked open
      if (!s.paused && !lockedRef.current) {
        for (let i = 0; i < PROJECTS.length; i++) {
          s.angles[i] -= ORBIT_CONFIG[i].speed * dt;
          if (s.angles[i] < ARC_START - 0.05) s.angles[i] = ARC_END + 0.05;
        }
      }

      // Planets
      for (let i = 0; i < PROJECTS.length; i++) drawPlanet(ctx, i, s.angles[i], s.hovered, W, H);

      s.raf = requestAnimationFrame(loop);
    };

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx   = e.clientX - rect.left;
      const my   = e.clientY - rect.top;
      const hit  = hitTest(mx, my, s.W, s.H, s.angles);

      // Only update visual highlight; never auto-open card
      if (hit !== s.hovered) {
        s.hovered = hit;
        s.paused  = hit >= 0 || lockedRef.current;
        canvas.style.cursor = hit >= 0 ? 'pointer' : 'default';
      }
    };

    const onMouseLeave = () => {
      s.hovered = -1;
      s.paused  = lockedRef.current;
      canvas.style.cursor = 'default';
    };

    const onClick = (e) => {
      if (lockedRef.current) return;
      const rect = canvas.getBoundingClientRect();
      const mx   = e.clientX - rect.left;
      const my   = e.clientY - rect.top;
      const hit  = hitTest(mx, my, s.W, s.H, s.angles);
      if (hit >= 0) {
        s.paused = true;
        onHoverChange(PROJECTS[hit]);
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(containerRef.current);

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);
    canvas.addEventListener('click', onClick);
    s.raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(s.raf);
      ro.disconnect();
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
      canvas.removeEventListener('click', onClick);
    };
  }, [onHoverChange, hitTest]);

  return canvasRef;
}

// ─── Project Card ─────────────────────────────────────────────────────────────
function ProjectCard({ project, visible, onClose }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: '40px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '300px',

        background: 'rgba(10,10,18,0.75)',
        border: `1px solid rgba(${project?.rgb ?? '255,255,255'},0.18)`,
        borderRadius: '18px',

        padding: '26px 24px',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',

        boxShadow: `
          0 0 0 1px rgba(255,255,255,0.04),
          0 10px 40px rgba(0,0,0,0.6),
          0 0 30px rgba(${project?.rgb ?? '255,255,255'},0.08)
        `,

        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 0.35s ease',

        zIndex: 20,
      }}
    >
      {project && (
        <>
          {/* ─── TOP BAR ─── */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '18px'
          }}>
            <span style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '10px',
              letterSpacing: '0.18em',
              color: `rgba(${project.rgb},0.7)`
            }}>
              {project.id}
            </span>

            <button
              onClick={onClose}
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.05)',
                color: '#aaa',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.color = '#aaa';
              }}
            >
              ✕
            </button>
          </div>

          {/* ─── TITLE ─── */}
          <h3 style={{
            fontFamily: '"Syne", sans-serif',
            fontSize: '20px',
            fontWeight: 700,
            color: '#ffffff',
            marginBottom: '4px',
            letterSpacing: '-0.02em'
          }}>
            {project.title}
          </h3>

          <p style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '11px',
            color: 'rgba(255,255,255,0.35)',
            marginBottom: '16px',
            letterSpacing: '0.05em'
          }}>
            {project.subtitle}
          </p>

          {/* ─── CATEGORY TAG ─── */}
          <div style={{
            display: 'inline-block',
            marginBottom: '16px',
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '9px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            background: `rgba(${project.rgb},0.12)`,
            color: project.color,
            border: `1px solid rgba(${project.rgb},0.25)`
          }}>
            {project.category}
          </div>

          {/* ─── DESCRIPTION ─── */}
          <p style={{
            fontFamily: '"Inter", sans-serif',
            fontSize: '13px',
            color: 'rgba(255,255,255,0.5)',
            lineHeight: 1.7,
            marginBottom: '20px'
          }}>
            {project.description}
          </p>

          {/* ─── TECH STACK ─── */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            marginBottom: '22px'
          }}>
            {project.tags.map(tag => (
              <span key={tag} style={{
                fontSize: '9px',
                fontFamily: '"JetBrains Mono", monospace',
                padding: '4px 8px',
                borderRadius: '5px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.6)'
              }}>
                {tag}
              </span>
            ))}
          </div>

          {/* ─── ACTIONS ─── */}
          <div style={{ display: 'flex', gap: '10px' }}>
            {project.githubUrl && project.githubUrl !== '#' && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  padding: '10px',
                  textAlign: 'center',
                  borderRadius: '8px',
                  background: project.color,
                  color: '#080808',
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textDecoration: 'none',
                  transition: 'transform 0.2s ease, opacity 0.2s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.opacity = '0.85';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.opacity = '1';
                }}
              >
                VIEW PROJECT
              </a>
            )}

            <a
              href="#"
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'rgba(255,255,255,0.6)',
                fontSize: '10px',
                letterSpacing: '0.1em',
                textDecoration: 'none'
              }}
            >
              SOURCE
            </a>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Projects() {
  const sectionRef    = useGSAPScrollReveal({ y: 30, duration: 0.7 });
  const containerRef  = useRef(null);
  const [hovered, setHovered]   = useState(null);
  const [locked, setLocked]     = useState(false);

  const onHoverChange = useCallback((proj) => {
    setHovered(proj);
    setLocked(true);   // planet click → lock card open
  }, []);

  const onClose = useCallback(() => {
    setHovered(null);
    setLocked(false);  // close button → resume orbits
  }, []);

  const canvasRef = useOrbitCanvas({ containerRef, onHoverChange, locked });

  return (
    <section id="projects" className="section-wrapper">

      {/* Header */}
      <div ref={sectionRef} style={{ marginBottom: '48px' }}>
        <span className="section-label">// orbital missions</span>
        <h2 className="section-heading">Projects</h2>
        <p style={{
          fontFamily:   '"JetBrains Mono", monospace',
          fontSize:      '12px',
          color:         '#2a2a2a',
          letterSpacing: '0.08em',
          marginTop:     '8px',
        }}>
          {PROJECTS.length} missions deployed — click a planet to inspect
        </p>
      </div>

      {/* Solar System Canvas Stage */}
      <div
        className="full-bleed"
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100vw',
          left: '50%',
          transform: 'translateX(-50%)',
          height: 'min(70vh, 700px)',

          background: 'transparent',
          overflow: 'hidden',

          borderTop: '1px solid rgba(255,255,255,0.06)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset:    0,
            width:    '100%',
            height:   '100%',
          }}
        />

        {/* Glassmorphic project card */}
        <ProjectCard project={hovered} visible={!!hovered} onClose={onClose} />

        {/* Hint label — fades when a planet is hovered */}
        <div
          style={{
            position:      'absolute',
            bottom:         '20px',
            left:           '50%',
            transform:      'translateX(-50%)',
            fontFamily:     '"JetBrains Mono", monospace',
            fontSize:        '9px',
            letterSpacing:   '0.18em',
            color:           'rgba(255,255,255,0.15)',
            whiteSpace:      'nowrap',
            pointerEvents:   'none',
            opacity:          hovered ? 0 : 1,
            transition:      'opacity 0.3s ease',
            zIndex:           5,
          }}
        >
          // CLICK A PLANET TO INSPECT MISSION
        </div>

        {/* Mission counter — top right */}
        <div style={{
          position:    'absolute',
          top:          '20px',
          right:        '24px',
          fontFamily:   '"JetBrains Mono", monospace',
          fontSize:      '10px',
          letterSpacing: '0.14em',
          color:         'rgba(255,255,255,0.14)',
          pointerEvents: 'none',
          zIndex:         5,
        }}>
          {PROJECTS.length} / {PROJECTS.length} MISSIONS
        </div>

        {/* Planet legend dots — bottom left */}
        <div style={{
          position:     'absolute',
          bottom:        '20px',
          left:          '20px',
          display:       'flex',
          flexDirection: 'column',
          gap:           '7px',
          pointerEvents: 'none',
          zIndex:         5,
          opacity:        hovered ? 0 : 0.7,
          transition:    'opacity 0.3s ease',
        }}>
          {PROJECTS.map(p => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <div style={{
                width:        '5px',
                height:       '5px',
                borderRadius: '50%',
                background:   p.color,
                boxShadow:    `0 0 5px ${p.color}`,
                flexShrink:   0,
              }} />
              <span style={{
                fontFamily:   '"JetBrains Mono", monospace',
                fontSize:      '8px',
                letterSpacing: '0.1em',
                color:         'rgba(255,255,255,0.3)',
              }}>
                {p.id} · {p.title}
              </span>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}