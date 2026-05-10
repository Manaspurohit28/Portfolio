import './globals.css';
import StarfieldCanvas from '@/components/three/StarfieldCanvas';

export const metadata = {
  title: 'Manas Purohit — Portfolio',
  description: 'Software Developer · ML · GenAI',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
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