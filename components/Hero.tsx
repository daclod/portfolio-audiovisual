import React from 'react';

const Hero: React.FC = () => {
  const handleProjectsClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetElement = document.getElementById('projects');
    
    if (targetElement) {
      const headerHeight = 80;
      const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
      
      // Disparar evento personalizado para animar el título
      const scrollEvent = new CustomEvent('section-scroll', { detail: { sectionId: 'projects' } });
      window.dispatchEvent(scrollEvent);
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-800 [mask-image:linear-gradient(to_bottom,white_20%,transparent_100%)]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/0 to-slate-900"></div>
        <div className="z-10">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-white animate-fade-in-down">
                Transformando Ideas en
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600 text-glow mt-2 md:mt-4">
                    Historias Visuales
                </span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-slate-400 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                Creador de Contenido Digital especializado en Edición Audiovisual y Producción Musical.
            </p>
            <a 
                href="#projects"
                onClick={handleProjectsClick}
                className="mt-10 inline-block bg-cyan-500 text-white font-bold py-3 px-8 rounded-full hover:bg-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/20 animate-fade-in-up"
                style={{ animationDelay: '1s' }}
            >
                Ver Mis Proyectos
            </a>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
            <div className="w-6 h-10 border-2 border-slate-600 rounded-full flex justify-center p-1">
                <div className="w-1 h-2 bg-slate-600 rounded-full animate-scroll-down"></div>
            </div>
        </div>

        {/* FIX: Removed 'jsx' prop from style tag to fix TypeScript error. */}
        <style>{`
            @keyframes fade-in-down {
                0% { opacity: 0; transform: translateY(-20px); }
                100% { opacity: 1; transform: translateY(0); }
            }
            @keyframes fade-in-up {
                0% { opacity: 0; transform: translateY(20px); }
                100% { opacity: 1; transform: translateY(0); }
            }
            @keyframes scroll-down {
                0%, 20% { transform: translateY(0); }
                50% { transform: translateY(12px); }
                100% { transform: translateY(12px); opacity: 0; }
            }
            .animate-fade-in-down { animation: fade-in-down 1s ease-out forwards; }
            .animate-fade-in-up { animation: fade-in-up 1s ease-out forwards; }
            .animate-scroll-down { animation: scroll-down 2s ease-out infinite; }
            .bg-grid-slate-800 {
                background-image: linear-gradient(white 1px, transparent 1px), linear-gradient(to right, white 1px, transparent 1px);
                background-size: 2rem 2rem;
                opacity: 0.05;
            }
        `}</style>
    </section>
  );
};

export default Hero;
