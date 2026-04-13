// src/components/three/SolarSystem.jsx
'use client';

import { Suspense, lazy } from 'react';
import { Canvas }         from '@react-three/fiber';

const ParticleField = lazy(() => import('./ParticleField'));

export default function SolarSystem() {
  return (
    <Canvas
      camera={{
        position: [0, 2.5, 11],
        fov:      65,
        near:     0.1,
        far:      1000,
      }}
      style={{
        width:      '100%',
        height:     '100%',
        background: 'transparent',
      }}
      gl={{
        antialias:       true,
        alpha:           true,
        powerPreference: 'high-performance',
      }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0.12} />

      <Suspense fallback={null}>
        <ParticleField count={2000} />
      </Suspense>
    </Canvas>
  );
}