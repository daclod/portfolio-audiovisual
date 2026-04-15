
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
    // Select all section children inside the main container
    const sections = gsap.utils.toArray('.gsap-reveal-section');

    sections.forEach((section: any) => {
      gsap.fromTo(
        section,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%', // Triggers when the top of the section hits 80% of viewport height
            end: 'top 20%',
            toggleActions: 'play none none reverse', // Play forward on enter, reverse on scroll back up
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
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