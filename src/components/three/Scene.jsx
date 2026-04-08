// src/components/three/Scene.jsx
'use client';

import { Suspense, lazy } from 'react';
import { Canvas }         from '@react-three/fiber';

// ✅ Use simple background particles — NOT the solar system
const BackgroundParticles = lazy(() => import('./BackgroundParticles'));

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75, near: 0.1, far: 1000 }}
      style={{
        position:      'absolute',
        top:           0,
        left:          0,
        width:         '100%',
        height:        '100%',
        pointerEvents: 'none',
      }}
      gl={{
        antialias:       true,
        alpha:           true,
        powerPreference: 'high-performance',
      }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0.2} />

      <Suspense fallback={null}>
        <BackgroundParticles count={800} />
      </Suspense>
    </Canvas>
  );
}
