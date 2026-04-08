// src/components/three/ParticleField.jsx
'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree }         from '@react-three/fiber';
import * as THREE                     from 'three';

function ParticleField({ count = 3000 }) {
  const groupRef      = useRef(null);
  const isDragging    = useRef(false);
  const previousMouse = useRef({ x: 0, y: 0 });
  const velocity      = useRef({ x: 0, y: 0 });
  const autoRotation  = useRef({ x: 0, y: 0 });
  const ringRefs      = useRef([]);

  const { gl } = useThree();

  // ── Sun — white/silver instead of orange/gold ─────────
  const SunCore = () => {
    const coreRef  = useRef();
    const corona1  = useRef();
    const corona2  = useRef();
    const corona3  = useRef();
    const flareRef = useRef();

    useFrame(({ clock }) => {
      const t = clock.getElapsedTime();

      if (coreRef.current) {
        const pulse = 1 + Math.sin(t * 2.1) * 0.04;
        coreRef.current.scale.setScalar(pulse);
      }

      if (corona1.current) corona1.current.rotation.z += 0.001;
      if (corona2.current) corona2.current.rotation.z -= 0.0007;
      if (corona3.current) corona3.current.rotation.z += 0.0004;

      if (flareRef.current) {
        flareRef.current.material.opacity =
          0.04 + Math.sin(t * 1.5) * 0.02;
      }
    });

    return (
      <group position={[0, 0, 0]}>

        {/* Outermost glow — very large, very faint white */}
        <mesh>
          <sphereGeometry args={[1.8, 32, 32]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.008}
            depthWrite={false}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Outer corona 3 */}
        <mesh ref={corona3}>
          <sphereGeometry args={[1.1, 32, 32]} />
          <meshBasicMaterial
            color="#dddddd"
            transparent
            opacity={0.015}
            depthWrite={false}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Outer corona 2 */}
        <mesh ref={corona2}>
          <sphereGeometry args={[0.75, 32, 32]} />
          <meshBasicMaterial
            color="#eeeeee"
            transparent
            opacity={0.03}
            depthWrite={false}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Inner corona 1 */}
        <mesh ref={corona1}>
          <sphereGeometry args={[0.48, 32, 32]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.07}
            depthWrite={false}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Flare halo */}
        <mesh ref={flareRef}>
          <sphereGeometry args={[0.36, 32, 32]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.04}
            depthWrite={false}
          />
        </mesh>

        {/* Sun surface — bright white core */}
        <mesh ref={coreRef}>
          <sphereGeometry args={[0.22, 64, 64]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={2.0}
            roughness={0.0}
            metalness={0.8}
          />
        </mesh>

        {/* White light source */}
        <pointLight
          color="#ffffff"
          intensity={2}
          distance={20}
          decay={2}
        />

      </group>
    );
  };

  // ── Rings — white/silver/grey palette ─────────────────
  const rings = useMemo(() => [
    {
      id:      1,
      radius:  1.6,
      count:   280,
      speed:   0.008,
      tilt:    0.08,
      color:   '#ffffff',
      size:    0.028,
      opacity: 1.0,
      spread:  0.15,
    },
    {
      id:      2,
      radius:  2.6,
      count:   360,
      speed:   0.005,
      tilt:    0.25,
      color:   '#dddddd',
      size:    0.022,
      opacity: 0.85,
      spread:  0.2,
    },
    {
      id:      3,
      radius:  3.6,
      count:   420,
      speed:   0.0035,
      tilt:    0.55,
      color:   '#ffffff',
      size:    0.018,
      opacity: 0.6,
      spread:  0.25,
    },
    {
      id:      4,
      radius:  4.7,
      count:   380,
      speed:   0.0025,
      tilt:    0.9,
      color:   '#cccccc',
      size:    0.015,
      opacity: 0.45,
      spread:  0.3,
    },
    {
      id:      5,
      radius:  5.8,
      count:   320,
      speed:   0.002,
      tilt:    1.2,
      color:   '#aaaaaa',
      size:    0.013,
      opacity: 0.35,
      spread:  0.3,
    },
    {
      id:      6,
      radius:  7.0,
      count:   280,
      speed:   0.0015,
      tilt:    1.55,
      color:   '#ffffff',
      size:    0.011,
      opacity: 0.25,
      spread:  0.35,
    },
    {
      id:      7,
      radius:  8.3,
      count:   240,
      speed:   0.001,
      tilt:    0.35,
      color:   '#dddddd',
      size:    0.009,
      opacity: 0.18,
      spread:  0.4,
    },
  ], []);

  // ── Ring geometry — unchanged ──────────────────────────
  const ringGeometries = useMemo(() => {
    return rings.map(ring => {
      const positions = new Float32Array(ring.count * 3);
      for (let i = 0; i < ring.count; i++) {
        const angle  = (i / ring.count) * Math.PI * 2;
        const jitter = (Math.random() - 0.5) * ring.spread;
        const r      = ring.radius + jitter;
        const yOff   = (Math.random() - 0.5) * ring.spread * 0.4;
        positions[i * 3]     = Math.cos(angle) * r;
        positions[i * 3 + 1] = yOff;
        positions[i * 3 + 2] = Math.sin(angle) * r;
      }
      return positions;
    });
  }, [rings]);

  // ── Starfield — white/silver/grey only ────────────────
  const starfield = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors    = new Float32Array(count * 3);
    const sizes     = new Float32Array(count);

    const white  = new THREE.Color('#ffffff');
    const silver = new THREE.Color('#aaaaaa');
    const grey   = new THREE.Color('#555555');
    const dim    = new THREE.Color('#1a1a1a');

    for (let i = 0; i < count; i++) {
      const i3     = i * 3;
      const radius = 8 + Math.random() * 14;
      const theta  = Math.random() * Math.PI * 2;
      const phi    = Math.acos((Math.random() * 2) - 1);

      positions[i3]     = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      const rand  = Math.random();
      const color = rand < 0.15
        ? white
        : rand < 0.30
          ? silver
          : rand < 0.45
            ? grey
            : dim;

      colors[i3]     = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
      sizes[i]       = Math.random() * 1.5 + 0.3;
    }

    return { positions, colors, sizes };
  }, [count]);

  // ── Mouse / touch — unchanged ─────────────────────────
  useEffect(() => {
    const canvas = gl.domElement;

    const onMouseDown = (e) => {
      isDragging.current    = true;
      previousMouse.current = { x: e.clientX, y: e.clientY };
      velocity.current      = { x: 0, y: 0 };
      canvas.style.cursor   = 'grabbing';
    };
    const onMouseMove = (e) => {
      if (!isDragging.current) return;
      const dx = e.clientX - previousMouse.current.x;
      const dy = e.clientY - previousMouse.current.y;
      velocity.current = { x: dx * 0.003, y: dy * 0.003 };
      if (groupRef.current) {
        groupRef.current.rotation.y += dx * 0.003;
        groupRef.current.rotation.x += dy * 0.003;
      }
      previousMouse.current = { x: e.clientX, y: e.clientY };
    };
    const onMouseUp = () => {
      isDragging.current  = false;
      canvas.style.cursor = 'grab';
    };
    const onTouchStart = (e) => {
      isDragging.current    = true;
      previousMouse.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
      velocity.current = { x: 0, y: 0 };
    };
    const onTouchMove = (e) => {
      if (!isDragging.current) return;
      const dx = e.touches[0].clientX - previousMouse.current.x;
      const dy = e.touches[0].clientY - previousMouse.current.y;
      velocity.current = { x: dx * 0.003, y: dy * 0.003 };
      if (groupRef.current) {
        groupRef.current.rotation.y += dx * 0.003;
        groupRef.current.rotation.x += dy * 0.003;
      }
      previousMouse.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    };
    const onTouchEnd = () => { isDragging.current = false; };

    canvas.style.cursor = 'grab';
    canvas.addEventListener('mousedown',  onMouseDown);
    canvas.addEventListener('mousemove',  onMouseMove);
    canvas.addEventListener('mouseup',    onMouseUp);
    canvas.addEventListener('mouseleave', onMouseUp);
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchmove',  onTouchMove,  { passive: true });
    canvas.addEventListener('touchend',   onTouchEnd);

    return () => {
      canvas.removeEventListener('mousedown',  onMouseDown);
      canvas.removeEventListener('mousemove',  onMouseMove);
      canvas.removeEventListener('mouseup',    onMouseUp);
      canvas.removeEventListener('mouseleave', onMouseUp);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove',  onTouchMove);
      canvas.removeEventListener('touchend',   onTouchEnd);
    };
  }, [gl]);

  // ── Animation loop — unchanged ────────────────────────
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    ringRefs.current.forEach((ref, i) => {
      if (!ref) return;
      ref.rotation.y += delta * rings[i].speed;
    });

    if (!groupRef.current) return;

    if (isDragging.current) {
      autoRotation.current.y = groupRef.current.rotation.y;
      autoRotation.current.x = groupRef.current.rotation.x;
    } else if (
      Math.abs(velocity.current.x) > 0.00005 ||
      Math.abs(velocity.current.y) > 0.00005
    ) {
      groupRef.current.rotation.y += velocity.current.x;
      groupRef.current.rotation.x += velocity.current.y;
      velocity.current.x *= 0.96;
      velocity.current.y *= 0.96;
      autoRotation.current.y = groupRef.current.rotation.y;
      autoRotation.current.x = groupRef.current.rotation.x;
    } else {
      autoRotation.current.y += delta * 0.012;
      autoRotation.current.x  = Math.sin(t * 0.05) * 0.18;
      groupRef.current.rotation.y = autoRotation.current.y;
      groupRef.current.rotation.x = autoRotation.current.x;
    }
  });

  return (
    <group ref={groupRef}>

      <SunCore />

      {rings.map((ring, i) => (
        <group
          key={ring.id}
          ref={el => { ringRefs.current[i] = el; }}
          rotation={[ring.tilt, 0, 0]}
        >
          {/* Orbit path */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[ring.radius, 0.003, 4, 180]} />
            <meshBasicMaterial
              color={ring.color}
              transparent
              opacity={ring.opacity * 0.12}
              depthWrite={false}
            />
          </mesh>

          {/* Particles */}
          <points>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[ringGeometries[i], 3]}
              />
            </bufferGeometry>
            <pointsMaterial
              color={ring.color}
              size={ring.size}
              transparent
              opacity={ring.opacity}
              sizeAttenuation
              depthWrite={false}
            />
          </points>
        </group>
      ))}

      {/* Starfield */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[starfield.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[starfield.colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.018}
          vertexColors
          transparent
          opacity={0.5}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

    </group>
  );
}

export default ParticleField;