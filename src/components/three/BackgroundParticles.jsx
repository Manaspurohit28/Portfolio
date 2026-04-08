// src/components/three/BackgroundParticles.jsx
'use client';

import { useRef, useMemo } from 'react';
import { useFrame }        from '@react-three/fiber';
import * as THREE          from 'three';

export default function BackgroundParticles({ count = 800 }) {
  const meshRef = useRef(null);

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors    = new Float32Array(count * 3);

    const white  = new THREE.Color('#ffffff');
    const silver = new THREE.Color('#888888');
    const dim    = new THREE.Color('#222222');

    for (let i = 0; i < count; i++) {
      const i3     = i * 3;
      const radius = 4 + Math.random() * 10;
      const theta  = Math.random() * Math.PI * 2;
      const phi    = Math.acos((Math.random() * 2) - 1);

      positions[i3]     = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      const rand  = Math.random();
      const color = rand < 0.15
        ? white
        : rand < 0.35
          ? silver
          : dim;

      colors[i3]     = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    return { positions, colors };
  }, [count]);

  // Very slow drift rotation
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.01;
    meshRef.current.rotation.x += delta * 0.004;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        vertexColors
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}