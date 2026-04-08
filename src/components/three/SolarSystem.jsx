// src/components/three/SolarSystem.jsx
'use client';

import { Suspense, lazy } from 'react';
import { Canvas }         from '@react-three/fiber';

const ParticleField = lazy(() => import('./ParticleField'));

export default function SolarSystem() {
  return (
    <Canvas
      camera={{
        position: [0, 3, 10],
        fov:      55,
        near:     0.1,
        far:      1000,
      }}
      style={{
        width:   '100%',
        height:  '100%',
        background: 'transparent',
      }}
      gl={{
        antialias:       true,
        alpha:           true,
        powerPreference: 'high-performance',
      }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0.1} />

      <Suspense fallback={null}>
        <ParticleField count={2000} />
      </Suspense>
    </Canvas>
  );
}