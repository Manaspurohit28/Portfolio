import './globals.css';
import StarfieldCanvas from '@/components/three/StarfieldCanvas';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* 🌌 GLOBAL STARFIELD — stays full screen behind everything */}
        <StarfieldCanvas />

        {/* PAGE ROOT: locks all content to 1152px, centered on any screen */}
        <div id="page-root" style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </div>
      </body>
    </html>
  );
}