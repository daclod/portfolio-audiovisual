
import React, { useState, useEffect } from 'react';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      
      // Detectar sección activa
      const sections = ['about', 'studies', 'skills', 'projects', 'music', 'contact'];
      const scrollPosition = window.scrollY + 150; // Offset para el header
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          // Use getBoundingClientRect to get true position regardless of CSS transforms from GSAP
          const rect = element.getBoundingClientRect();
          const offsetTop = rect.top + window.scrollY;
          const offsetBottom = offsetTop + rect.height;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Llamar una vez al cargar
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      const headerHeight = 80; // Altura aproximada del header
      // Use getBoundingClientRect to calculate exact position relative to current scroll
      const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
      
      // Disparar evento personalizado para animar el título
      const scrollEvent = new CustomEvent('section-scroll', { detail: { sectionId: targetId } });
      window.dispatchEvent(scrollEvent);
      
      // Scroll suave con offset
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  };

  const navLinks = [
    { href: '#about', label: 'Sobre Mí' },
    { href: '#studies', label: 'Estudios' },
    { href: '#skills', label: 'Habilidades' },
    { href: '#projects', label: 'Proyectos' },
    { href: '#music', label: 'Música' },
    { href: '#contact', label: 'Contacto' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? 'bg-slate-900/80 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-6 md:px-12 py-4 flex justify-between items-center">
        <a 
          href="#" 
          className="text-xl md:text-2xl font-bold text-white tracking-wider"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <span className="text-cyan-400">{'<'}</span>
          {'AV'}
          <span className="text-cyan-400">{'>'}</span>
        </a>
        <div className="hidden md:flex space-x-8">
          {navLinks.map((link) => {
            const sectionId = link.href.substring(1);
            const isActive = activeSection === sectionId;
            
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`text-slate-300 hover:text-cyan-400 transition-colors duration-200 relative group ${
                  isActive ? 'text-cyan-400' : ''
                }`}
              >
                {link.label}
                <span 
                  className={`absolute bottom-0 left-0 h-0.5 bg-cyan-400 transition-all duration-300 ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                ></span>
              </a>
            );
          })}
        </div>
        {/* Mobile menu could be added here */}
      </nav>
    </header>
  );
};

export default Header;