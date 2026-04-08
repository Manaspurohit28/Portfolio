// src/components/ui/MusicPlayer.jsx
'use client';

import { useState, useEffect, useRef } from 'react';

export const audioData = {
  analyser:     null,
  dataArray:    null,
  isPlaying:    false,
  bassLevel:    0,
  midLevel:     0,
  trebleLevel:  0,
  beatDetected: false,
};

export default function MusicPlayer() {
  const [playing,  setPlaying]  = useState(true);  // ← default ON
  const [mounted,  setMounted]  = useState(false);
  const [bars,     setBars]     = useState([3, 5, 3, 5, 3]);

  const audioRef    = useRef(null);
  const contextRef  = useRef(null);
  const analyserRef = useRef(null);
  const animRef     = useRef(null);

  useEffect(() => {
    setMounted(true);

    const audio  = new Audio('/music/amb.mp3');
    audio.loop   = true;
    audioRef.current = audio;

    // ── Autoplay as soon as user interacts with page ──
    // Browsers block autoplay until first interaction
    const startOnInteraction = () => {
      setupAnalyser(audio);

      if (contextRef.current?.state === 'suspended') {
        contextRef.current.resume();
      }

      audio.play().catch(() => {
        // If autoplay blocked silently fail
        setPlaying(false);
      });

      audioData.isPlaying = true;
      startBarsAnimation();

      // Remove listeners after first interaction
      window.removeEventListener('click',     startOnInteraction);
      window.removeEventListener('keydown',   startOnInteraction);
      window.removeEventListener('touchstart',startOnInteraction);
      window.removeEventListener('scroll',    startOnInteraction);
    };

    // Try immediate autoplay first
    const tryImmediatePlay = async () => {
      try {
        setupAnalyser(audio);
        await audio.play();
        audioData.isPlaying = true;
        startBarsAnimation();
      } catch {
        // Autoplay blocked — wait for first interaction
        setPlaying(false); // show as paused until interaction
        window.addEventListener('click',      startOnInteraction, { once: true });
        window.addEventListener('keydown',    startOnInteraction, { once: true });
        window.addEventListener('touchstart', startOnInteraction, { once: true });
        window.addEventListener('scroll',     startOnInteraction, { once: true });
      }
    };

    tryImmediatePlay();

    return () => {
      cancelAnimationFrame(animRef.current);
      audio.pause();
      audio.src = '';
      window.removeEventListener('click',      startOnInteraction);
      window.removeEventListener('keydown',    startOnInteraction);
      window.removeEventListener('touchstart', startOnInteraction);
      window.removeEventListener('scroll',     startOnInteraction);
      if (contextRef.current) contextRef.current.close();
      audioData.isPlaying = false;
    };
  }, []);

  // ── Setup Web Audio API ───────────────────────────────
  const setupAnalyser = (audioEl) => {
    if (analyserRef.current) return;
    const audio = audioEl || audioRef.current;
    if (!audio) return;

    const ctx      = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = ctx.createAnalyser();
    analyser.fftSize               = 256;
    analyser.smoothingTimeConstant = 0.75;

    const source = ctx.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(ctx.destination);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    contextRef.current  = ctx;
    analyserRef.current = analyser;
    audioData.analyser  = analyser;
    audioData.dataArray = dataArray;
  };

  // ── Wave bar animation ────────────────────────────────
  const startBarsAnimation = () => {
    const animate = () => {
      animRef.current = requestAnimationFrame(animate);

      if (analyserRef.current && audioData.dataArray) {
        analyserRef.current.getByteFrequencyData(audioData.dataArray);
        const d   = audioData.dataArray;
        const len = d.length;

        setBars([
          3 + (d[Math.floor(len * 0.05)] / 255) * 16,
          3 + (d[Math.floor(len * 0.15)] / 255) * 16,
          3 + (d[Math.floor(len * 0.25)] / 255) * 16,
          3 + (d[Math.floor(len * 0.15)] / 255) * 16,
          3 + (d[Math.floor(len * 0.05)] / 255) * 16,
        ]);
      } else {
        const t = Date.now() / 200;
        setBars([
          3 + Math.abs(Math.sin(t + 0)) * 8,
          3 + Math.abs(Math.sin(t + 1)) * 8,
          3 + Math.abs(Math.sin(t + 2)) * 8,
          3 + Math.abs(Math.sin(t + 1)) * 8,
          3 + Math.abs(Math.sin(t + 0)) * 8,
        ]);
      }
    };

    animate();
  };

  // ── Toggle play / pause ───────────────────────────────
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      cancelAnimationFrame(animRef.current);
      audioData.isPlaying = false;
      setBars([3, 5, 3, 5, 3]);
      setPlaying(false);
    } else {
      if (contextRef.current?.state === 'suspended') {
        contextRef.current.resume();
      }
      audio.play().catch(() => {});
      audioData.isPlaying = true;
      startBarsAnimation();
      setPlaying(true);
    }
  };

  if (!mounted) return null;

  return (
    <div
      style={{
        position:       'fixed',
        bottom:         '24px',
        right:          '24px',
        zIndex:         500,
        display:        'flex',
        alignItems:     'center',
        gap:            '10px',
        padding:        '10px 16px',
        background:     'rgba(17,17,17,0.85)',
        backdropFilter: 'blur(12px)',
        border:         '1px solid rgba(255,255,255,0.07)',
        borderRadius:   '40px',
        transition:     'border-color 0.2s ease',
      }}
      onMouseEnter={e =>
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}
      onMouseLeave={e =>
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
    >

      {/* Play / Pause */}
      <button
        onClick={togglePlay}
        aria-label={playing ? 'Pause music' : 'Play music'}
        style={{
          width:          '32px',
          height:         '32px',
          borderRadius:   '50%',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          background:     'transparent',
          border:         'none',
          cursor:         'pointer',
          padding:        0,
          flexShrink:     0,
          color:          playing ? '#ffffff' : '#888888',
          transition:     'color 0.2s ease',
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
        onMouseLeave={e =>
          e.currentTarget.style.color = playing ? '#ffffff' : '#888888'}
      >
        {playing ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6"  y="4" width="4" height="16" rx="1.5"/>
            <rect x="14" y="4" width="4" height="16" rx="1.5"/>
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
        )}
      </button>

      {/* Wave bars */}
      <div style={{
        display:    'flex',
        alignItems: 'center',
        gap:        '3px',
        height:     '20px',
      }}>
        {bars.map((h, i) => (
          <div
            key={i}
            style={{
              width:        '3px',
              height:       `${h}px`,
              borderRadius: '2px',
              background:   playing ? '#ffffff' : '#333333',
              transition:   playing
                ? 'height 0.1s ease, background 0.3s ease'
                : 'height 0.4s ease, background 0.3s ease',
            }}
          />
        ))}
      </div>

    </div>
  );
}
