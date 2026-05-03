// src/components/three/ParticleField.jsx
'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useThree }                   from '@react-three/fiber';
import { Html }                                 from '@react-three/drei';
import * as THREE                               from 'three';

// ─────────────────────────────────────────────────────────
// SPEED CONTROLS — tweak these to change how fast things move
// ─────────────────────────────────────────────────────────
const SPEED = {
  // Overall galaxy auto-rotation (Y axis). Higher = faster spin.
  // Try: 0.008 (slow), 0.016 (default), 0.028 (fast)
  galaxyRotation: 0.039,

  // How much the galaxy tilts back and forth on X axis
  // Try: 0.04 (subtle), 0.08 (default), 0.14 (dramatic)
  galaxyTilt: 0.18,

  // Multiplier applied to every planet's orbital speed
  // Try: 0.8 (slow), 1.4 (default), 2.5 (fast)
  planetOrbit: 1.4,

  // How fast each planet spins on its own axis
  // Try: 0.2 (slow), 0.5 (default), 1.0 (fast)
  planetSpin: 0.5,
};
// ─────────────────────────────────────────────────────────

// ── B&W planet palette — brightness encodes importance ───
const TECH_PLANETS = [
  {
    name:        'Python',
    category:    'Core Language',
    level:       92,
    orbitRadius: 2.0,
    size:        0.30,
    color:       '#ffffff',   // brightest — most core
    emissive:    '#ffffff',
    emissiveInt: 0.9,
    roughness:   0.15,
    metalness:   0.6,
    glowColor:   '#ffffff',
    speed:       0.0055,
    startAngle:  0,
    accentColor: '#a8d8ff',  // only color shown — in tooltip only
  },
  {
    name:        'Machine Learning',
    category:    'AI / ML',
    level:       85,
    orbitRadius: 3.2,
    size:        0.24,
    color:       '#dddddd',
    emissive:    '#cccccc',
    emissiveInt: 0.6,
    roughness:   0.25,
    metalness:   0.5,
    glowColor:   '#dddddd',
    speed:       0.004,
    startAngle:  Math.PI * 0.7,
    accentColor: '#ffb085',
  },
  {
    name:        'React',
    category:    'Frontend',
    level:       78,
    orbitRadius: 4.5,
    size:        0.20,
    color:       '#aaaaaa',
    emissive:    '#999999',
    emissiveInt: 0.45,
    roughness:   0.3,
    metalness:   0.45,
    glowColor:   '#aaaaaa',
    speed:       0.003,
    startAngle:  Math.PI * 1.4,
    accentColor: '#85e8ff',
  },
  {
    name:        'TensorFlow',
    category:    'Deep Learning',
    level:       70,
    orbitRadius: 5.8,
    size:        0.15,
    color:       '#666666',
    emissive:    '#555555',
    emissiveInt: 0.35,
    roughness:   0.5,
    metalness:   0.3,
    glowColor:   '#888888',
    speed:       0.0022,
    startAngle:  Math.PI * 0.3,
    accentColor: '#ffcc85',
  },
  {
    name:        'Docker',
    category:    'DevOps',
    level:       60,
    orbitRadius: 7.2,
    size:        0.12,
    color:       '#333333',
    emissive:    '#2a2a2a',
    emissiveInt: 0.25,
    roughness:   0.7,
    metalness:   0.2,
    glowColor:   '#555555',
    speed:       0.0015,
    startAngle:  Math.PI * 1.1,
    accentColor: '#85b8ff',
  },
];

// ── Tooltip ───────────────────────────────────────────────
function SkillLabel({ name, category, level, accentColor }) {
  const filled = Math.round(level / 20);
  return (
    <div style={{
      background:    'rgba(6,6,6,0.92)',
      border:        '1px solid rgba(255,255,255,0.12)',
      borderRadius:  '10px',
      padding:       '10px 14px',
      minWidth:      '160px',
      pointerEvents: 'none',
      boxShadow:     '0 0 32px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)',
      backdropFilter:'blur(12px)',
    }}>
      <p style={{
        fontFamily:  'Syne, sans-serif',
        fontWeight:  700,
        fontSize:    '0.82rem',
        color:       '#f5f5f5',
        margin:      '0 0 2px',
        whiteSpace:  'nowrap',
      }}>
        {name}
      </p>
      <p style={{
        fontFamily:    'JetBrains Mono, monospace',
        fontSize:      '0.58rem',
        color:         accentColor,
        margin:        '0 0 8px',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        whiteSpace:    'nowrap',
      }}>
        {category}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <div style={{ display: 'flex', gap: '3px' }}>
          {[1,2,3,4,5].map(i => (
            <div key={i} style={{
              width:        '18px',
              height:       '3px',
              borderRadius: '2px',
              background:   i <= filled
                ? accentColor
                : 'rgba(255,255,255,0.07)',
            }} />
          ))}
        </div>
        <span style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontSize:   '0.58rem',
          color:      'rgba(255,255,255,0.35)',
        }}>
          {level}%
        </span>
      </div>
    </div>
  );
}

// ── Single planet ─────────────────────────────────────────
function TechPlanet({ planet }) {
  const orbitRef = useRef(null);
  const meshRef  = useRef(null);
  const glowRef  = useRef(null);
  const rimRef   = useRef(null);
  const angleRef = useRef(planet.startAngle);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    angleRef.current += delta * planet.speed * SPEED.planetOrbit * (hovered ? 0.12 : 1);
    const x = Math.cos(angleRef.current) * planet.orbitRadius;
    const z = Math.sin(angleRef.current) * planet.orbitRadius;
    if (orbitRef.current) orbitRef.current.position.set(x, 0, z);
    if (meshRef.current)  meshRef.current.rotation.y  += delta * SPEED.planetSpin;

    if (glowRef.current) {
      const pulse = hovered ? 1 + Math.sin(Date.now() * 0.004) * 0.07 : 1;
      const scale = hovered ? 2.2 : 1.5;
      glowRef.current.scale.setScalar(pulse * scale);
      glowRef.current.material.opacity = hovered ? 0.18 : 0.06;
    }
    if (rimRef.current) {
      rimRef.current.material.opacity = hovered ? 0.5 : 0.15;
    }
  });

  return (
    <group ref={orbitRef}>
      {/* Outer soft glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[planet.size * 1.4, 16, 16]} />
        <meshBasicMaterial
          color={planet.glowColor}
          transparent
          opacity={0.06}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Rim light ring */}
      <mesh ref={rimRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[planet.size * 1.15, 0.008, 8, 64]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.15}
          depthWrite={false}
        />
      </mesh>

      {/* Planet body */}
      <mesh
        ref={meshRef}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true);  }}
        onPointerOut={()  => setHovered(false)}
      >
        <sphereGeometry args={[planet.size, 48, 48]} />
        <meshStandardMaterial
          color={planet.color}
          emissive={planet.emissive}
          emissiveIntensity={hovered ? planet.emissiveInt * 2.2 : planet.emissiveInt}
          roughness={planet.roughness}
          metalness={planet.metalness}
        />
      </mesh>

      {/* Subtle point light from planet */}
      <pointLight
        color="#ffffff"
        intensity={hovered ? 0.8 : 0.2}
        distance={3}
        decay={2}
      />

      {/* Tooltip */}
      {hovered && (
        <Html
          center
          position={[0, planet.size + 0.52, 0]}
          style={{ pointerEvents: 'none' }}
          zIndexRange={[100, 0]}
        >
          <SkillLabel
            name={planet.name}
            category={planet.category}
            level={planet.level}
            accentColor={planet.accentColor}
          />
        </Html>
      )}
    </group>
  );
}

// ── Orbit ring — thicker and more visible ─────────────────
function OrbitRing({ radius }) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, 0.009, 6, 220]} />
      <meshBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.18}
        depthWrite={false}
      />
    </mesh>
  );
}

// ── Sun ───────────────────────────────────────────────────
function SunCore() {
  const coreRef  = useRef();
  const corona1  = useRef();
  const corona2  = useRef();
  const corona3  = useRef();
  const flareRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (coreRef.current)  coreRef.current.scale.setScalar(1 + Math.sin(t * 2.1) * 0.04);
    if (corona1.current)  corona1.current.rotation.z  += 0.001;
    if (corona2.current)  corona2.current.rotation.z  -= 0.0007;
    if (corona3.current)  corona3.current.rotation.z  += 0.0004;
    if (flareRef.current) flareRef.current.material.opacity = 0.05 + Math.sin(t * 1.5) * 0.025;
  });

  return (
    <group>
      <mesh><sphereGeometry args={[2.4,32,32]}/><meshBasicMaterial color="#ffffff" transparent opacity={0.006} depthWrite={false} side={THREE.BackSide}/></mesh>
      <mesh ref={corona3}><sphereGeometry args={[1.4,32,32]}/><meshBasicMaterial color="#dddddd" transparent opacity={0.014} depthWrite={false} side={THREE.BackSide}/></mesh>
      <mesh ref={corona2}><sphereGeometry args={[0.95,32,32]}/><meshBasicMaterial color="#eeeeee" transparent opacity={0.028} depthWrite={false} side={THREE.BackSide}/></mesh>
      <mesh ref={corona1}><sphereGeometry args={[0.62,32,32]}/><meshBasicMaterial color="#ffffff" transparent opacity={0.065} depthWrite={false} side={THREE.BackSide}/></mesh>
      <mesh ref={flareRef}><sphereGeometry args={[0.44,32,32]}/><meshBasicMaterial color="#ffffff" transparent opacity={0.05} depthWrite={false}/></mesh>
      <mesh ref={coreRef}><sphereGeometry args={[0.26,64,64]}/><meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2.5} roughness={0} metalness={0.8}/></mesh>
      <pointLight color="#ffffff" intensity={3} distance={25} decay={2}/>
    </group>
  );
}

// ── Starfield — denser with varied brightness ─────────────
function Starfield({ count }) {
  const data = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors    = new Float32Array(count * 3);
    const sizes     = new Float32Array(count);

    // Brighter distribution — more whites/silvers, fewer near-black
    const bright  = new THREE.Color('#ffffff');
    const white   = new THREE.Color('#eeeeee');
    const silver  = new THREE.Color('#bbbbbb');
    const grey    = new THREE.Color('#777777');
    const dim     = new THREE.Color('#3a3a3a');

    for (let i = 0; i < count; i++) {
      const i3     = i * 3;
      const radius = 10 + Math.random() * 20;
      const theta  = Math.random() * Math.PI * 2;
      const phi    = Math.acos((Math.random() * 2) - 1);
      positions[i3]     = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      const rand  = Math.random();
      // 10% bright white, 20% white, 25% silver, 25% grey, 20% dim
      const color = rand < 0.10 ? bright
                  : rand < 0.30 ? white
                  : rand < 0.55 ? silver
                  : rand < 0.80 ? grey
                  : dim;

      colors[i3] = color.r; colors[i3+1] = color.g; colors[i3+2] = color.b;

      // Vary sizes — a few anchor stars noticeably bigger
      sizes[i] = rand < 0.04
        ? Math.random() * 0.04 + 0.035   // big anchor stars
        : rand < 0.20
          ? Math.random() * 0.022 + 0.014 // medium
          : Math.random() * 0.012 + 0.006; // fine dust
    }
    return { positions, colors, sizes };
  }, [count]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[data.colors,    3]} />
        <bufferAttribute attach="attributes-size"     args={[data.sizes,     1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.028}
        vertexColors
        transparent
        opacity={0.75}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ── Main ──────────────────────────────────────────────────
function ParticleField({ count = 4500 }) {
  const groupRef      = useRef(null);
  const isDragging    = useRef(false);
  const previousMouse = useRef({ x: 0, y: 0 });
  const velocity      = useRef({ x: 0, y: 0 });
  const autoRotation  = useRef({ x: 0, y: 0 });
  const { gl }        = useThree();

  useEffect(() => {
    const canvas = gl.domElement;
    const onMouseDown  = (e) => { isDragging.current = true;  previousMouse.current = { x: e.clientX, y: e.clientY }; velocity.current = { x: 0, y: 0 }; };
    const onMouseMove  = (e) => {
      if (!isDragging.current) return;
      const dx = e.clientX - previousMouse.current.x;
      const dy = e.clientY - previousMouse.current.y;
      velocity.current = { x: dx * 0.003, y: dy * 0.003 };
      if (groupRef.current) { groupRef.current.rotation.y += dx * 0.003; groupRef.current.rotation.x += dy * 0.003; }
      previousMouse.current = { x: e.clientX, y: e.clientY };
    };
    const onMouseUp    = () => { isDragging.current = false; };
    const onTouchStart = (e) => { isDragging.current = true;  previousMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; velocity.current = { x: 0, y: 0 }; };
    const onTouchMove  = (e) => {
      if (!isDragging.current) return;
      const dx = e.touches[0].clientX - previousMouse.current.x;
      const dy = e.touches[0].clientY - previousMouse.current.y;
      velocity.current = { x: dx * 0.003, y: dy * 0.003 };
      if (groupRef.current) { groupRef.current.rotation.y += dx * 0.003; groupRef.current.rotation.x += dy * 0.003; }
      previousMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchEnd   = () => { isDragging.current = false; };

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

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (!groupRef.current) return;
    if (isDragging.current) {
      autoRotation.current.y = groupRef.current.rotation.y;
      autoRotation.current.x = groupRef.current.rotation.x;
    } else if (Math.abs(velocity.current.x) > 0.00005 || Math.abs(velocity.current.y) > 0.00005) {
      groupRef.current.rotation.y += velocity.current.x;
      groupRef.current.rotation.x += velocity.current.y;
      velocity.current.x *= 0.96;
      velocity.current.y *= 0.96;
      autoRotation.current.y = groupRef.current.rotation.y;
      autoRotation.current.x = groupRef.current.rotation.x;
    } else {
      autoRotation.current.y += delta * SPEED.galaxyRotation;
      autoRotation.current.x  = Math.sin(t * SPEED.galaxyTilt * 0.5) * 0.15;
      groupRef.current.rotation.y = autoRotation.current.y;
      groupRef.current.rotation.x = autoRotation.current.x;
    }
  });

  return (
    <group ref={groupRef}>
      <SunCore />
      {TECH_PLANETS.map(p => <OrbitRing key={p.name + '-ring'} radius={p.orbitRadius} />)}
      {TECH_PLANETS.map(p => <TechPlanet key={p.name} planet={p} />)}
      <Starfield count={count} />
    </group>
  );
}

export default ParticleField;