import { playerStore } from '../store/playerStore';
import { useState, useEffect } from 'react';

function NextEpisodeOverlay({ nextEpisode, onSkip }) {
  const { setShowNextEpisode } = playerStore();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (!nextEpisode) return;
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          if (onSkip) onSkip();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [nextEpisode, onSkip]);

  const handleCancel = () => {
    setShowNextEpisode(false);
  };

  const handleSkip = () => {
    if (onSkip) onSkip();
  };

  if (!nextEpisode) return null;

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md">
      <div className="bg-chill-dark/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl animate-fade-in">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-24 h-14 shrink-0 overflow-hidden rounded-lg">
            <img src={nextEpisode.thumbnail} alt={nextEpisode.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold text-lg">Episode Selanjutnya</h3>
            <p className="text-white/60 text-sm">{nextEpisode.title}</p>
          </div>
        </div>
        
        <p className="text-white/60 text-sm mb-4">{nextEpisode.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="text-white/40 text-sm">
            Memutar dalam {countdown}...
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-white/80 hover:text-white text-sm font-medium"
            >
              Batal
            </button>
            <button
              onClick={handleSkip}
              className="px-4 py-2 bg-chill-blue hover:bg-chill-blue/80 text-white text-sm font-bold rounded-lg transition-colors"
            >
              Putar Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NextEpisodeOverlay;
