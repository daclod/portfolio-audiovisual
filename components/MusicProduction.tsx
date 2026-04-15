
import React, { useRef, useState } from 'react';
import SectionTitle from './SectionTitle';

interface AudioPlayerProps {
  title: string;
  audioUrl: string;
  description: string;
  isFeatured?: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ title, audioUrl, description, isFeatured = false }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      audioRef.current.currentTime = parseFloat(e.target.value);
      setCurrentTime(parseFloat(e.target.value));
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isFeatured) {
    return (
      <div className="relative bg-slate-800/40 backdrop-blur-md p-5 sm:p-6 md:p-8 rounded-xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 overflow-hidden group hover:border-cyan-400/60 transition-colors duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl group-hover:bg-cyan-400/30 transition-colors duration-500"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-400/30 transition-colors duration-500"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <h4 className="text-lg sm:text-xl font-bold text-white">{title}</h4>
          </div>
          <p className="text-sm sm:text-base text-slate-200 mb-4 sm:mb-5">{description}</p>
          <div className="space-y-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={togglePlay}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-full p-3 sm:p-3.5 md:p-4 transition-all duration-200 flex-shrink-0 shadow-lg shadow-cyan-500/50 transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
              >
                {isPlaying ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
              <div className="flex-1 min-w-0">
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  aria-label="Progreso de audio"
                  className="w-full h-2 sm:h-2.5 bg-slate-700/50 rounded-lg appearance-none cursor-pointer accent-cyan-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                />
                <div className="flex justify-between text-sm text-slate-200 mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>
            <audio
              ref={audioRef}
              src={audioUrl}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => setIsPlaying(false)}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/40 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-lg border border-slate-700/50 hover:border-slate-600/80 transition-colors duration-300 shadow-xl shadow-black/20">
      <h4 className="text-base sm:text-lg font-bold text-white mb-1 sm:mb-2">{title}</h4>
      <p className="text-xs sm:text-sm text-slate-400 mb-3 sm:mb-4">{description}</p>
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <button
            onClick={togglePlay}
            className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-full p-2 sm:p-2.5 md:p-3 transition-colors duration-200 flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
          <div className="flex-1 min-w-0">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              aria-label="Progreso de audio"
              className="w-full h-1.5 sm:h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-0.5 sm:mt-1">
              <span className="text-xs">{formatTime(currentTime)}</span>
              <span className="text-xs">{formatTime(duration)}</span>
            </div>
          </div>
        </div>
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
        />
      </div>
    </div>
  );
};

const MusicProduction: React.FC = () => {
    const SlidersIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-cyan-400">
            <line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line>
            <line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line>
            <line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line>
            <line x1="17" y1="16" x2="23" y2="16"></line>
        </svg>
    );

    const WaveformIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-cyan-400">
            <path d="M2 13.1a1 1 0 0 0-1 1v.4a1 1 0 0 0 1 1h2.2a1 1 0 0 0 1-1v-1.8a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1.1V13Z" />
            <path d="M6.9 9.3a1 1 0 0 0-1 1v5.8a1 1 0 0 0 1 1h2.2a1 1 0 0 0 1-1V9.3a1 1 0 0 0-1-1H7.9a1 1 0 0 0-1 1v.4Z" />
            <path d="M11.8 7.5a1 1 0 0 0-1 1v9.4a1 1 0 0 0 1 1h2.2a1 1 0 0 0 1-1V7.5a1 1 0 0 0-1-1h-1.2a1 1 0 0 0-1 1v.4Z" />
            <path d="M16.7 5.7a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h2.2a1 1 0 0 0 1-1V5.7a1 1 0 0 0-1-1h-1.2a1 1 0 0 0-1 1v.4Z" />
        </svg>
    );
  
  return (
    <section id="music" className="container mx-auto">
      <SectionTitle title="Producción Musical" subtitle="El Arte de Esculpir el Sonido" sectionId="music" />
      <div className="mt-12 p-4 sm:p-6 md:p-8 bg-slate-800/50 border border-slate-700/50 rounded-lg shadow-xl relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
        
        <p className="text-center max-w-3xl mx-auto text-sm sm:text-base text-slate-400 mb-8 sm:mb-10 md:mb-12">
          Además, tengo experiencia en producción musical usando FL Studio, donde me he enfocado sobre todo en la mezcla y la masterización de canciones para llevar una producción desde su fase creativa hasta un acabado profesional.
        </p>
        
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 text-slate-400 leading-relaxed z-10 relative mb-6 sm:mb-8">
          <div className="bg-slate-900/40 p-4 sm:p-5 md:p-6 rounded-md border border-slate-700">
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <SlidersIcon/>
              <h3 className="text-xl sm:text-2xl font-bold text-white">Mezcla</h3>
            </div>
            <p className="text-sm sm:text-base">
              En la mezcla, trabajo ajustando volúmenes, ecualización, paneo y efectos para que cada pista (voces, instrumentos, beats) suene clara y equilibrada, creando un espacio sonoro cohesivo.
            </p>
          </div>
          <div className="bg-slate-900/40 p-4 sm:p-5 md:p-6 rounded-md border border-slate-700">
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <WaveformIcon/>
              <h3 className="text-xl sm:text-2xl font-bold text-white">Masterización</h3>
            </div>
            <p className="text-sm sm:text-base">
              En la masterización, doy los toques finales al tema completo: mejoro su sonoridad, controlo los picos, y preparo el audio para que suene potente y definido en diferentes plataformas de streaming.
            </p>
          </div>
        </div>

        {/* Reproductores de Audio Antes/Después */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6 z-10 relative mb-6 sm:mb-8">
          <AudioPlayer
            title="Antes"
            audioUrl={`${import.meta.env.BASE_URL || '/portfolio-audiovisual/'}assets/audio/ProduccionCancionAntes.mpeg`}
            description="Audio sin procesar, antes de la mezcla y masterización."
          />
          <AudioPlayer
            title="Después"
            audioUrl={`${import.meta.env.BASE_URL || '/portfolio-audiovisual/'}assets/audio/ProduccionCancionDespues.mpeg`}
            description="Audio procesado con mezcla y masterización profesional."
          />
        </div>

        {/* Disclaimer de Audífonos */}
        <div className="z-10 relative mb-4 sm:mb-5 flex items-center justify-center">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400/70 bg-slate-900/30 border border-slate-700/30 rounded-full px-3 sm:px-4 py-1.5 sm:py-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 14v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <path d="M17 14v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z"></path>
              <path d="M9 6v12"></path>
              <path d="M15 6v12"></path>
            </svg>
            <span className="text-slate-400/80">Para mayor inmersión, se recomienda usar audífonos</span>
          </div>
        </div>

        {/* Beat Destacado */}
        <div className="z-10 relative">
          <AudioPlayer
            title="Beat Original"
            audioUrl={`${import.meta.env.BASE_URL || '/portfolio-audiovisual/'}assets/audio/ProduccionBeat.mpeg`}
            description="Producción original de beat creada desde cero, demostrando habilidades en composición y producción musical."
            isFeatured={true}
          />
        </div>
      </div>
    </section>
  );
};

export default MusicProduction;
