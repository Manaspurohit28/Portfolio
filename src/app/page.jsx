// src/app/page.jsx
'use client';

import { useState }    from 'react';
import Navbar          from '@/components/layout/Navbar';
import Footer          from '@/components/layout/Footer';
import ScrollProgress  from '@/components/ui/ScrollProgress';
import Notification    from '@/components/ui/Notification';
import MusicPlayer     from '@/components/ui/MusicPlayer';
import DragHint        from '@/components/ui/DragHint';
import Hero            from '@/components/sections/Hero';
import About           from '@/components/sections/About';
import Projects        from '@/components/sections/Projects';
import Skills          from '@/components/sections/Skills';
import Experience      from '@/components/sections/Experience';
import Certificates    from '@/components/sections/Certificates';
import Contact         from '@/components/sections/Contact';
import CustomCursor    from '@/components/ui/CustomCursor';

export default function Home() {
  const [notification, setNotification] = useState('');

  return (
    <>
      <CustomCursor />
      <ScrollProgress />
      <Notification
        message={notification}
        onDone={() => setNotification('')}
      />

      {/* Fixed UI overlays */}
      <MusicPlayer />
      <DragHint />

      <Navbar />

      <main style={{ width: '100%', overflowX: 'hidden' }}>
        <Hero               setNotification={setNotification} />
        <About              />
        <Projects           setNotification={setNotification} />
        <Skills             />
        <Experience         />
        <Certificates       />
        <Contact            setNotification={setNotification} />
      </main>

      <Footer />
    </>
  );
}