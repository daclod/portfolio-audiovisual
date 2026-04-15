
import React from 'react';
import Header from './components/Header';
import BackgroundCanvas from './components/BackgroundCanvas';
import Hero from './components/Hero';
import About from './components/About';
import Studies from './components/Studies';
import Skills from './components/Skills';
import Projects from './components/Projects';
import MusicProduction from './components/MusicProduction';
import Contact from './components/Contact';

const App: React.FC = () => {
  return (
    <div className="bg-slate-900 min-h-screen text-slate-300 relative">
      <BackgroundCanvas />
      <Header />
      <main className="relative z-10">
        <Hero />
        <div className="space-y-24 md:space-y-32 px-6 md:px-12 lg:px-24">
          <About />
          <Studies />
          <Skills />
          <Projects />
          <MusicProduction />
          <Contact />
        </div>
      </main>
      <footer className="text-center p-8 text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()}. Diseñado y desarrollado con pasión.</p>
      </footer>
    </div>
  );
};

export default App;