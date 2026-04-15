
import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import { PROJECTS_DATA } from '../constants';
import { Project } from '../types';
import SectionTitle from './SectionTitle';

// Contexto para manejar qué video está reproduciéndose actualmente
interface VideoPreviewContextType {
  activeVideoId: string | null;
  setActiveVideoId: (id: string | null) => void;
}

const VideoPreviewContext = createContext<VideoPreviewContextType>({
  activeVideoId: null,
  setActiveVideoId: () => {},
});

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [showAutoHover, setShowAutoHover] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const delayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hideHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { activeVideoId, setActiveVideoId } = useContext(VideoPreviewContext);
  const videoId = project.title; // Usar el título como ID único

  useEffect(() => {
    // Detectar si es móvil
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint de Tailwind
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const hasPlayedOnceRef = useRef(false);
  const showAutoHoverRef = useRef(false);
  const isPreviewPlayingRef = useRef(false);

  // Tilt Effect State
  const [tiltStyle, setTiltStyle] = useState({ transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)' });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isMobile) return;

    const rect = cardRef.current.getBoundingClientRect();

    // Calculate mouse position relative to the center of the card
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Determine rotation based on mouse position (max 10 degrees)
    const rotateX = -(y / (rect.height / 2)) * 10;
    const rotateY = (x / (rect.width / 2)) * 10;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.1s ease-out'
    });
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s ease-in-out'
    });
  };

  useEffect(() => {
    if (!project.videoUrl || !isMobile || !videoPreviewRef.current || !cardRef.current) return;

    const video = videoPreviewRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            // Cuando el proyecto está visible en más del 50% del viewport
            if (!hasPlayedOnceRef.current) {
              // Primera vez: reproducir vista previa después de 3 segundos
              // Limpiar timeout anterior si existe
              if (delayTimeoutRef.current) {
                clearTimeout(delayTimeoutRef.current);
              }

              // Limpiar timeout de ocultar hover si existe
              if (hideHoverTimeoutRef.current) {
                clearTimeout(hideHoverTimeoutRef.current);
                hideHoverTimeoutRef.current = null;
              }
              
              // Si hay otro video activo, ocultar su hover inmediatamente cuando este entra
              if (activeVideoId && activeVideoId !== videoId) {
                setActiveVideoId(null); // Esto activará el efecto que oculta el hover del otro
              }
              
              // Esperar 3 segundos antes de reproducir (solo la primera vez)
              delayTimeoutRef.current = setTimeout(() => {
                // Verificar que aún está visible, no hay otro video activo, y no se ha reproducido ya
                if (entry.isIntersecting && !hasPlayedOnceRef.current && (!activeVideoId || activeVideoId === videoId)) {
                  video.currentTime = 0;
                  video.play().catch(() => {
                    // Silenciar errores de autoplay
                  });
                  setIsPreviewPlaying(true);
                  isPreviewPlayingRef.current = true;
                  setShowAutoHover(false);
                  showAutoHoverRef.current = false;
                  setActiveVideoId(videoId);
                }
              }, 3000); // 3 segundos de delay
            } else {
              // Ya se reprodujo la vista previa: solo ocultar hover de otros proyectos si entra en viewport
              // Limpiar timeout de ocultar hover si existe
              if (hideHoverTimeoutRef.current) {
                clearTimeout(hideHoverTimeoutRef.current);
                hideHoverTimeoutRef.current = null;
              }
              
              // Si hay otro video activo, ocultar su hover inmediatamente cuando este entra
              if (activeVideoId && activeVideoId !== videoId) {
                setActiveVideoId(null);
              }
              
              // NO reproducir de nuevo, solo mantener el hover si estaba activo
              // El hover se mantendrá visible hasta que otro proyecto entre en viewport
            }
          } else {
            // Cuando sale del viewport
            if (delayTimeoutRef.current) {
              clearTimeout(delayTimeoutRef.current);
              delayTimeoutRef.current = null;
            }
            
            // Si el video está reproduciéndose, pausarlo inmediatamente
            if (isPreviewPlayingRef.current) {
              video.pause();
              setIsPreviewPlaying(false);
              isPreviewPlayingRef.current = false;
            }
            
            // Cuando sale del viewport, mantener el estado
            // NO resetear hasPlayedOnceRef para que no se reproduzca de nuevo
            // El hover se ocultará cuando otro proyecto entre en viewport (manejado en el efecto)
            
            // Si este era el video activo, limpiarlo
            if (activeVideoId === videoId) {
              setActiveVideoId(null);
            }
          }
        });
      },
      {
        threshold: [0, 0.5, 1],
        rootMargin: '-50px 0px',
      }
    );

    observer.observe(cardRef.current);

    // Detectar cuando el video termina la vista previa (primeros 3 segundos)
    const handleTimeUpdate = () => {
      // Verificar si llegó a 3 segundos y aún no se ha activado el hover
      if (video.currentTime >= 3 && !hasPlayedOnceRef.current && isPreviewPlayingRef.current) {
        // Marcar como reproducido primero para evitar múltiples ejecuciones
        hasPlayedOnceRef.current = true;
        
        video.pause();
        setIsPreviewPlaying(false);
        isPreviewPlayingRef.current = false;
        
        // Activar hover automático
        setShowAutoHover(true);
        showAutoHoverRef.current = true;
        
        // Limpiar cualquier timeout de ocultar hover anterior
        if (hideHoverTimeoutRef.current) {
          clearTimeout(hideHoverTimeoutRef.current);
          hideHoverTimeoutRef.current = null;
        }
        
        // Liberar el slot de video activo
        if (activeVideoId === videoId) {
          setActiveVideoId(null);
        }
      }
    };

    // Detectar cuando el video termina completamente (por si acaso es muy corto)
    const handleEnded = () => {
      if (!hasPlayedOnceRef.current) {
        setIsPreviewPlaying(false);
        isPreviewPlayingRef.current = false;
        
        // Activar hover automático
        setShowAutoHover(true);
        showAutoHoverRef.current = true;
        hasPlayedOnceRef.current = true;
        
        // Limpiar cualquier timeout de ocultar hover anterior
        if (hideHoverTimeoutRef.current) {
          clearTimeout(hideHoverTimeoutRef.current);
          hideHoverTimeoutRef.current = null;
        }
        
        // Liberar el slot de video activo
        if (activeVideoId === videoId) {
          setActiveVideoId(null);
        }
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      observer.disconnect();
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      
      // Limpiar timeouts si existen
      if (delayTimeoutRef.current) {
        clearTimeout(delayTimeoutRef.current);
      }
      if (hideHoverTimeoutRef.current) {
        clearTimeout(hideHoverTimeoutRef.current);
      }
      
      // Resetear cuando se desmonta
      hasPlayedOnceRef.current = false;
      
      // Si este era el video activo, limpiarlo
      if (activeVideoId === videoId) {
        setActiveVideoId(null);
      }
    };
    }, [project.videoUrl, isMobile, activeVideoId, videoId, setActiveVideoId]);

  // Efecto separado para pausar si otro video se activa y ocultar hover
  useEffect(() => {
    if (!project.videoUrl || !isMobile || !videoPreviewRef.current) return;
    
    const video = videoPreviewRef.current;
    
    // Si hay otro video activo y no es este
    if (activeVideoId && activeVideoId !== videoId) {
        // Si este video está reproduciéndose, pausarlo
        if (isPreviewPlayingRef.current) {
          video.pause();
          setIsPreviewPlaying(false);
          isPreviewPlayingRef.current = false;
          // NO resetear hasPlayedOnceRef para que no se reproduzca de nuevo
        }
        // Si este proyecto tiene hover activo, ocultarlo cuando otro video se activa
        if (showAutoHoverRef.current) {
          setShowAutoHover(false);
          showAutoHoverRef.current = false;
        }
      // Cancelar el timeout si está esperando para reproducir
      if (delayTimeoutRef.current) {
        clearTimeout(delayTimeoutRef.current);
        delayTimeoutRef.current = null;
      }
      // Cancelar timeout de ocultar hover
      if (hideHoverTimeoutRef.current) {
        clearTimeout(hideHoverTimeoutRef.current);
        hideHoverTimeoutRef.current = null;
      }
    }
  }, [activeVideoId, videoId, project.videoUrl, isMobile]);

  const openVideo = () => {
    if (project.videoUrl) {
      setIsVideoOpen(true);
      document.body.style.overflow = 'hidden';
      // Pausar la vista previa si está reproduciéndose
      if (videoPreviewRef.current) {
        videoPreviewRef.current.pause();
        setIsPreviewPlaying(false);
      }
    }
  };

  const closeVideo = () => {
    setIsVideoOpen(false);
    document.body.style.overflow = 'unset';
  };

  return (
    <>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={!isMobile ? tiltStyle : {}}
        className={`group relative overflow-hidden rounded-lg shadow-2xl bg-slate-800 border border-slate-700/50 ${
          project.videoUrl ? 'cursor-pointer' : ''
        } hover:border-cyan-500/50 hover:shadow-cyan-500/20 z-10 ${
          isMobile && showAutoHover ? 'border-cyan-500/50' : ''
        }`}
        onClick={project.videoUrl ? openVideo : undefined}
      >
        <div className="relative">
          {/* Imagen estática para desktop y fallback */}
          <img
            src={project.imageUrl}
            alt={project.title}
            className={`w-full h-48 sm:h-56 md:h-64 object-cover transition-transform duration-500 ease-in-out ${
              isMobile && showAutoHover 
                ? 'scale-110' 
                : 'group-hover:scale-110'
            } ${
              isMobile && isPreviewPlaying ? 'opacity-0 absolute inset-0' : 'opacity-100'
            }`}
          />
          
          {/* Video preview para móviles */}
          {project.videoUrl && isMobile && (
            <>
              <video
                ref={videoPreviewRef}
                src={project.videoUrl}
                muted
                playsInline
                loop={false}
                preload="metadata"
                className={`w-full h-48 sm:h-56 md:h-64 object-cover transition-opacity duration-300 ${
                  isPreviewPlaying ? 'opacity-100' : 'opacity-0 absolute inset-0'
                }`}
              />
              
              {/* Indicador sutil de video cuando no está reproduciéndose */}
              {!isPreviewPlaying && !showAutoHover && (
                <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-full p-1.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              )}
            </>
          )}

          {/* Overlay de hover para desktop y móvil con hover automático */}
          {project.videoUrl && (
            <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
              isMobile && showAutoHover
                ? 'opacity-100'
                : 'opacity-0 group-hover:opacity-100'
            }`}>
              <div className={`bg-cyan-500/90 rounded-full p-2.5 sm:p-3 transition-transform duration-300 ${
                isMobile && showAutoHover
                  ? 'transform scale-100'
                  : 'transform scale-75 group-hover:scale-100'
              }`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 sm:w-10 sm:h-10 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        </div>
        <div className="absolute bottom-0 left-0 p-3 sm:p-4 md:p-6 text-white transition-all duration-500 w-full">
          <h3 className="text-base sm:text-lg md:text-xl font-bold line-clamp-2">{project.title}</h3>
          <p className="text-xs sm:text-sm text-cyan-300 mb-1 sm:mb-2">{project.category}</p>
          <div className={`transition-all duration-500 ease-in-out ${
            isMobile && showAutoHover 
              ? 'max-h-40 opacity-100' 
              : 'max-h-0 opacity-0 group-hover:max-h-40 group-hover:opacity-100'
          }`}>
            <p className="text-slate-300 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">{project.description}</p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {project.tools.map(tool => (
                <span key={tool} className="text-xs bg-slate-700 text-cyan-300 px-2 py-1 rounded-full">{tool}</span>
              ))}
            </div>
            {project.videoUrl && (
              <p className="text-xs text-cyan-400 mt-2 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Ver proyecto completo
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Video */}
      {isVideoOpen && project.videoUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm overflow-y-auto"
          onClick={closeVideo}
        >
          <div className="min-h-full flex items-start sm:items-center justify-center py-4 sm:py-8 px-2 sm:px-4">
            <div
              className="relative w-full max-w-6xl bg-slate-900 rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeVideo}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 bg-slate-800 hover:bg-slate-700 text-white rounded-full p-2 transition-colors duration-200 shadow-lg"
                aria-label="Cerrar"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="p-4 sm:p-5 md:p-6">
                <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white mb-2 pr-10 sm:pr-0 break-words">{project.title}</h2>
                <p className="text-xs sm:text-sm md:text-base text-cyan-300 mb-3 sm:mb-4">{project.category}</p>
                <div className="relative w-full mb-4 aspect-video max-h-[60vh] sm:max-h-none">
                  <video
                    src={project.videoUrl}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full rounded-lg object-contain"
                  >
                    Tu navegador no soporta la reproducción de video.
                  </video>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 mb-3 sm:mb-4 break-words">{project.description}</p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {project.tools.map((tool) => (
                    <span key={tool} className="text-xs bg-slate-700 text-cyan-300 px-2 sm:px-3 py-1 rounded-full">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const Projects: React.FC = () => {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  return (
    <VideoPreviewContext.Provider value={{ activeVideoId, setActiveVideoId }}>
      <section id="projects" className="container mx-auto">
        <SectionTitle title="Proyectos Destacados" subtitle="Donde las Ideas Cobran Vida" sectionId="projects" />
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROJECTS_DATA.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </section>
    </VideoPreviewContext.Provider>
  );
};

export default Projects;
