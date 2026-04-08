// src/hooks/useGSAP.js
'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin once globally
// Safe to call multiple times — GSAP deduplicates
gsap.registerPlugin(ScrollTrigger);

// ─── Hook 1: useGSAPEntrance ──────────────────────────
// Animates children of a container element on mount
// Usage: const ref = useGSAPEntrance()
export function useGSAPEntrance(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const {
      selector  = '.gsap-reveal',   // which children to animate
      duration  = 0.6,
      stagger   = 0.12,
      y         = 32,
      delay     = 0,
    } = options;

    const targets = el.querySelectorAll(selector);
    if (!targets.length) return;

    // Set initial state
    gsap.set(targets, { opacity: 0, y });

    // Animate in
    const tween = gsap.to(targets, {
      opacity:  1,
      y:        0,
      duration,
      stagger,
      delay,
      ease:     'power3.out',
    });

    return () => tween.kill();
  }, []);

  return ref;
}

// ─── Hook 2: useGSAPScrollReveal ─────────────────────
// Reveals an element when it enters the viewport
// Usage: const ref = useGSAPScrollReveal()
export function useGSAPScrollReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const {
      y         = 40,
      duration  = 0.7,
      delay     = 0,
      start     = 'top 85%',
    } = options;

    gsap.fromTo(
      el,
      { opacity: 0, y },
      {
        opacity:  1,
        y:        0,
        duration,
        delay,
        ease:     'power3.out',
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: 'play none none none',
        },
      }
    );

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return ref;
}

// ─── Hook 3: useGSAPStaggerReveal ────────────────────
// Reveals a list of children with stagger when parent enters viewport
// Usage: const ref = useGSAPStaggerReveal()
export function useGSAPStaggerReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const {
      selector  = '.stagger-item',
      y         = 24,
      duration  = 0.5,
      stagger   = 0.08,
      start     = 'top 80%',
    } = options;

    const targets = el.querySelectorAll(selector);
    if (!targets.length) return;

    gsap.fromTo(
      targets,
      { opacity: 0, y },
      {
        opacity:  1,
        y:        0,
        duration,
        stagger,
        ease:     'power3.out',
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: 'play none none none',
        },
      }
    );

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  }, []);

  return ref;
}

// ─── Hook 4: useGSAPHover ────────────────────────────
// Adds a GSAP-powered hover lift effect to an element
// Usage: const ref = useGSAPHover()
export function useGSAPHover(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const {
      y        = -6,
      scale    = 1.02,
      duration = 0.25,
    } = options;

    const onEnter = () =>
      gsap.to(el, { y, scale, duration, ease: 'power2.out' });

    const onLeave = () =>
      gsap.to(el, { y: 0, scale: 1, duration, ease: 'power2.out' });

    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);

    return () => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return ref;
}

// ─── Default export — base GSAP context hook ─────────
// For custom one-off animations inside components
// Usage:
//   const containerRef = useGSAP((gsap) => {
//     gsap.from('.my-element', { opacity: 0, y: 20 })
//   })
function useGSAP(callback, deps = []) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    // Create a scoped GSAP context so cleanup is automatic
    const ctx = gsap.context(() => {
      callback(gsap);
    }, ref);

    return () => ctx.revert();
  }, deps);

  return ref;
}

export default useGSAP;