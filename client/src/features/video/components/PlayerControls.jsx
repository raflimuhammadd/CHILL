import { useState, useEffect } from 'react';
import { playerStore } from '../store/playerStore';
import Icon from '../../../components/ui/Icon';

function PlayerControls({ isSeries = false, 
  nextEpisode, onVolumeChange, onPlayPause, onSeek }) {
  const { isPlaying, isMuted, volume, 
    showControls, currentTime, duration, buffered, toggleFullscreen, 
    setShowControls, activeMenu, openMenu, closeMenu,
  } = playerStore();
  
  const [showTooltip, setShowTooltip] = useState(null);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  useEffect(() => {
    let timeout;
    if (isPlaying && !activeMenu) {
      timeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    } else if (!isPlaying) {
      setShowControls(true);
    }
    return () => clearTimeout(timeout);
  }, [isPlaying, activeMenu, setShowControls]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleMouseEnter = () => {
    setShowControls(true);
  };

  const handleMouseLeave = () => {
    if (isPlaying && !activeMenu) {
      setShowControls(false);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
  };

  const handleSkipBack = () => {
    const newTime = Math.max(0, currentTime - 10);
    if (onSeek) {
      onSeek(newTime);
    }
  };

  const handleSkipForward = () => {
    const newTime = Math.min(duration, currentTime + 10);
    if (onSeek) {
      onSeek(newTime);
    }
  };

  const handleNextEpisode = () => {
    if (nextEpisode) {
      closeMenu();
      nextEpisode();
    }
  };

  return (
    <div
      className={`
        absolute bottom-0 left-0 right-0
        bg-chill-dark/80 backdrop-blur-sm
        transition-all duration-300
        ${activeMenu ? 'opacity-100' : ''}
        ${showControls ? 'opacity-100' : 'opacity-0'}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <div className="px-6 py-4 container-responsive">
      <div className="relative w-full h-1 group cursor-pointer mb-4">
        <div className="absolute inset-0 rounded-full bg-white/20">
          <div 
            className="h-full rounded-full bg-white/30 transition-all"
        style={{ width: duration > 0 ? `${(buffered / duration) * 100}%` : '0%' }}
            >
          </div>
          <div className="absolute inset-0 rounded-full bg-white/20">
            <div
              className='h-full rounded-full bg-blue-600 relative transition-all'
              style={{width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%'}}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white
              rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity">
              </div>
            </div>
            <input 
              type='range'
              min={0}
              max={duration || 0}
              step={0.1}
              value={currentTime}
              onChange={(e) => {
                e.stopPropagation()
                onSeek(parseFloat(e.target.value))
              }}
              className='absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10'
            />
          </div>
        </div>
      </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onPlayPause}
              className="text-3xl hover:scale-110 transition-transform"
              onMouseEnter={() => setShowTooltip('Play/Pause')}
              onMouseLeave={() => setShowTooltip(null)}
            >
              {isPlaying ? (
                <Icon name="pause" className="w-10 h-10 fill-white stroke-0"/>
              ) : (
                <Icon name="play" className="w-10 h-10 fill-white stroke-0"/>
              )}
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSkipBack}
                className="text-white/80 hover:text-white"
                onMouseEnter={() => setShowTooltip('-10s')}
                onMouseLeave={() => setShowTooltip(null)}
              >
                <Icon name="skipBack" className="w-10 h-10 mt-5"/>
              </button>
              <button
                onClick={handleSkipForward}
                className="text-white/80 hover:text-white"
                onMouseEnter={() => setShowTooltip('+10s')}
                onMouseLeave={() => setShowTooltip(null)}
              >
                <Icon name="skipForward" className="w-10 h-10 mt-5"/>
              </button>
            </div>

            <div className="flex items-center gap-2 group">
              <button
                onClick={() => {
                  if (isMuted) {
                    onVolumeChange(volume > 0 ? volume : 50);
                  } else {
                    onVolumeChange(0);
                  }

                }}
                className="text-white/80 hover:text-white"
                onMouseEnter={() => setShowTooltip(isMuted ? 'Unmute' : 'Mute')}
                onMouseLeave={() => setShowTooltip(null)}
              >
                {isMuted || volume === 0 ? (
                  <Icon name="speaker-x" className="w-6 h-6" />
                ) : volume <= 33 ? (
                  <Icon name="volumeLow" className="w-6 h-6"/>
                ) : volume <= 66 ? (
                  <Icon name="volumeMedium" className="w-6 h-6"/>
                ) : (
                  <Icon name="volumeHigh" className="w-6 h-6"/>
                )}
              </button>

              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    e.stopPropagation();
                    const newVolume = parseInt(e.target.value);
                    onVolumeChange(newVolume);
                  }}
                  onFocus={() => setShowVolumeSlider(true)}
                  onBlur={() => setShowVolumeSlider(false)}
                  onMouseEnter={() => setShowVolumeSlider(true)}
                  onMouseLeave={() => setShowVolumeSlider(false)}
                  className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer opacity-0"
                  style={{ opacity: showVolumeSlider ? 1 : 0 }}
                />
                <div className={`absolute bottom-full left-0 transition-opacity duration-200 ${showVolumeSlider ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="w-24 bg-black/90 rounded px-2 py-1 text-xs text-white">
                    {isMuted ? 0 : volume}%
                  </div>
                </div>
              </div>
            </div>

            <div className="text-white/80 text-sm font-sans">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div className="flex items-center gap-4">
            
            {isSeries && nextEpisode && (
              <button
                onClick={handleNextEpisode}
                className="flex items-center gap-2 text-white/80 hover:text-white"
                onMouseEnter={() => setShowTooltip('Next Episode')}
                onMouseLeave={() => setShowTooltip(null)}
              >
                <Icon name="nextEps"/>
              </button>
            )}

            {isSeries && (
              <button
                onClick={() => openMenu('episodes')}
                className="text-white/80 hover:text-white"
                onMouseEnter={() => setShowTooltip('Episodes')}
                onMouseLeave={() => setShowTooltip(null)}
              >
                <Icon name="listEps"/>
              </button>
            )}

            <button
              onClick={() => openMenu('subtitle')}
              className="text-white/80 hover:text-white"
              onMouseEnter={() => setShowTooltip('Subtitle')}
              onMouseLeave={() => setShowTooltip(null)}
            >
              <Icon name="subtitle"/>
            </button>

            <button
              onClick={() => openMenu('speed')}
              className="text-white/80 hover:text-white"
              onMouseEnter={() => setShowTooltip('Speed')}
              onMouseLeave={() => setShowTooltip(null)}
            >
              <Icon name="speed"/>
            </button>

            <button
              onClick={toggleFullscreen}
              className="text-white/80 hover:text-white"
              onMouseEnter={() => setShowTooltip('Fullscreen')}
              onMouseLeave={() => setShowTooltip(null)}
            >
              <Icon name="fullscreen"/>
            </button>
          </div>
        </div>

        {showTooltip && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/70 text-white text-xs py-1 px-3 rounded">
            {showTooltip}
          </div>
        )}
      </div>
    </div>
  );
}

export default PlayerControls;
