
import React, { useLayoutEffect, useRef } from 'react';
import Header from './components/Header';
import BackgroundCanvas from './components/BackgroundCanvas';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero from './components/Hero';
import About from './components/About';
import Studies from './components/Studies';
import Skills from './components/Skills';
import Projects from './components/Projects';
import MusicProduction from './components/MusicProduction';
import Contact from './components/Contact';

gsap.registerPlugin(ScrollTrigger);

const App: React.FC = () => {
  const mainRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Select all section children inside the main container
      const sections = gsap.utils.toArray('.gsap-reveal-section');

      sections.forEach((section: any) => {
        // Set initial state via CSS/GSAP so it doesn't flash before JS runs
        gsap.set(section, { opacity: 0, y: 50 });

        ScrollTrigger.create({
          trigger: section,
          start: 'top 90%', // Trigger slightly earlier to ensure it shows when navigating
          onEnter: () => {
            gsap.to(section, {
              opacity: 1,
              y: 0,
              duration: 1.2,
              ease: 'power3.out',
              overwrite: 'auto'
            });
          },
          // We don't reverse the animation on scroll up to prevent the "disappearing" bug
          // when clicking nav links that jump around the page.
        });
      });
    }, mainRef); // Scope to mainRef

    // Force a ScrollTrigger refresh after a short delay to account for any initial layout shifts
    // (e.g., images loading, 3D canvas initializing)
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    return () => {
      clearTimeout(timeout);
      ctx.revert(); // Safely clean up all GSAP animations and ScrollTriggers created in this context
    };
  }, []);

  return (
    <div className="bg-slate-900/80 min-h-screen text-slate-300 relative">
      {/* BackgroundCanvas provides the 3D deep parallax background */}
      <BackgroundCanvas />

      <Header />

      <main ref={mainRef} className="relative z-10">
        <Hero />

        <div className="space-y-24 md:space-y-32 px-6 md:px-12 lg:px-24 pb-24">
          <div className="gsap-reveal-section"><About /></div>
          <div className="gsap-reveal-section"><Studies /></div>
          <div className="gsap-reveal-section"><Skills /></div>
          <div className="gsap-reveal-section"><Projects /></div>
          <div className="gsap-reveal-section"><MusicProduction /></div>
          <div className="gsap-reveal-section"><Contact /></div>
        </div>
      </main>

      <footer className="relative z-10 text-center p-8 text-slate-500 text-sm bg-slate-900/50 backdrop-blur-sm border-t border-slate-800">
        <p>&copy; {new Date().getFullYear()}. Diseñado y desarrollado con pasión.</p>
      </footer>
    </div>
  );
};

export default App;