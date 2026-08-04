import { useState, useEffect, useRef, useCallback } from 'react';
import { playerStore } from '../store/playerStore';
import PlayerControls from './PlayerControls';
import PremiumGateModal from './PremiumGateModal';
import SubtitleMenu from './SubtitleMenu';
import PlaybackSpeedMenu from './PlaybackSpeedMenu';
import EpisodeListMenu from './EpisodeListMenu';
import NextEpisodeOverlay from './NextEpisodeOverlay';

function VideoPlayer({ youtubeId, title, isBlocked, episodes, currentEpisodeId, onEpisodeChange }) {
  const { 
    isPlaying, isMuted, volume, currentTime, duration, 
    isFullscreen, activeMenu, showNextEpisode, 
    setPlaying, setMuted, setVolume, setCurrentTime, 
    setDuration, setBuffered, toggleFullscreen, setShowControls, 
    closeMenu, setShowNextEpisode, reset
  } = playerStore();

  const iframeRef = useRef(null);
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [idleTimer, setIdleTimer] = useState(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  const isSeries = episodes && episodes.length > 0;
  const nextEpisode = isSeries ? episodes.find(ep => ep.id === currentEpisodeId + 1) : null;

  useEffect(() => {
    if (!containerRef.current) return;
    
    if (isFullscreen) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error('Fullscreen error:', err);
        toggleFullscreen();
      });
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => {
          console.error('Exit fullscreen error:', err);
        });
      }
    }
  }, [isFullscreen, toggleFullscreen]);

  useEffect(() => {
    if (activeMenu) {
      setShowControls(true);
    } else if (isPlaying) {
      setShowControls(false);
    }
  }, [activeMenu, isPlaying, setShowControls]);

  const sendMessageToIframe = useCallback((message) => {
    if (iframeRef.current?.contentWindow && isPlayerReady) {
      iframeRef.current.contentWindow.postMessage(JSON.stringify(message), '*');
    }
  }, [isPlayerReady]);

  const handleIframeMessage = useCallback((event) => {
    console.log('>>> RAW:', typeof event.data, event.data);
    if (!event.data || typeof event.data !== 'string') return;
    
    try {
      console.log('[YouTube Event]', event.data);
      const data = JSON.parse(event.data);
      if (data.event === 'onStateChange') {
        setPlaying(data.info === 1);
      }

      if (data.event === 'infoDelivery' && data.info) {
        if (data.info.currentTime !== undefined) setCurrentTime(data.info.currentTime);
        if (data.info.duration !== undefined) setDuration(data.info.duration);
        if (data.info.videoLoadedFraction !== undefined) setBuffered(data.info.videoLoadedFraction);
      }
      
      if (data.event === 'onError') {
        setError('Error memuat video');
        setPlaying(false);
      }
    } catch (e) {
      console.error('Message parse error:', e);
    }
  }, [setPlaying, setCurrentTime, setDuration, setBuffered]);

      useEffect(() => {
      window.addEventListener('message', handleIframeMessage);
      return () => {
        window.removeEventListener('message', handleIframeMessage);
      };
    }, [handleIframeMessage]);

    useEffect(() => {
      if (!isPlayerReady) return;
      const interval = setInterval(() => {
        sendMessageToIframe({ event: 'command', func: 'getCurrentTime', args: [] });
        sendMessageToIframe({ event: 'command', func: 'getDuration', args: [] });
      }, 1000);
      return () => clearInterval(interval);
  }, [isPlayerReady, sendMessageToIframe]);


  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      setPlaying(false);
      sendMessageToIframe({ event: 'command', func: 'pauseVideo', args: [] });
    } else {
      setPlaying(true);
      sendMessageToIframe({ event: 'command', func: 'playVideo', args: [] });
    }
  }, [isPlaying, setPlaying, sendMessageToIframe]);

  const handleVolumeChange = useCallback((newVolume) => {
    setVolume(newVolume);
    if (newVolume === 0) {
      setMuted(true);
      sendMessageToIframe({ event: 'command', func: 'mute', args: [] });
    } else {
      setMuted(false);
      sendMessageToIframe({ event: 'command', func: 'unMute', args: [] });
      sendMessageToIframe({ event: 'command', func: 'setVolume', args: [newVolume] });
    }
  }, [setVolume, setMuted, sendMessageToIframe]);

  const handleSeek = useCallback((time) => {
    setCurrentTime(time);
    sendMessageToIframe({ event: 'command', func: 'seekTo', args: [time, true] });
  }, [setCurrentTime, sendMessageToIframe]);

  const handleNextEpisode = useCallback(() => {
    if (nextEpisode) {
      closeMenu();
      onEpisodeChange?.(nextEpisode.id);
      reset();
    }
  }, [nextEpisode, closeMenu, onEpisodeChange, reset]);

  const handleContainerClick = useCallback((e) => {
    const isInteractive = e.target.closest('button, input, a, [role="button"]');
    
    if (!isInteractive) {
      handlePlayPause();
    }
  }, [handlePlayPause]);

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (idleTimer) clearTimeout(idleTimer);
    setIdleTimer(setTimeout(() => {
      if (isPlaying && !activeMenu) setShowControls(false);
    }, 3000));
  }, [isPlaying, activeMenu, setShowControls, idleTimer]);

  const handleKeyDown = useCallback((e) => {
    switch (e.key) {
      case ' ':
        e.preventDefault();
        handlePlayPause();
        break;
      case 'ArrowLeft':
        handleSeek(Math.max(0, currentTime - 10));
        break;
      case 'ArrowRight':
        handleSeek(Math.min(duration, currentTime + 10));
        break;
      case 'm':
      case 'M':
        handleVolumeChange(isMuted ? (volume > 0 ? volume : 50) : 0);
        break;
      case 'f':
      case 'F':
        toggleFullscreen();
        break;
      case 'Escape':
        if (isFullscreen) {
          toggleFullscreen();
        } else if (activeMenu) {
          closeMenu();
        }
        break;
    }
  }, [handlePlayPause, handleSeek, handleVolumeChange, currentTime, duration, isMuted, volume, toggleFullscreen, isFullscreen, activeMenu, closeMenu]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isPlaying) {
      let remaining = Math.max(0, duration - currentTime);
      if (remaining <= 30 && isSeries && nextEpisode) {
        setShowNextEpisode(true);
      } else if (remaining > 30) {
        setShowNextEpisode(false);
      }
    }
  }, [currentTime, duration, isPlaying, isSeries, nextEpisode, setShowNextEpisode]);

  const handleSkipIntro = useCallback((e) => {
    e.stopPropagation();
    handleSeek(90);
  }, [handleSeek]);

  const showIntroSkip = isPlaying && currentTime >= 5 && currentTime <= 90;


  
  
const iframeSrc = `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&controls=0&disablekb=1&fs=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&playsinline=1&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`;
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <div className="text-center">
          <p className="text-xl mb-4">Error: {error}</p>
          <button onClick={() => setError(null)} className="px-4 py-2 bg-white/10 rounded hover:bg-white/20">
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  if (isBlocked) {
    return (
      <div className="relative w-full h-screen md:h-[85vh] bg-black flex items-center justify-center">
        <PremiumGateModal />
      </div>
    );
  }


  return (
    <div
      ref={containerRef}
      className={`relative w-full h-screen md:h-[85vh] bg-black transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-100' : ''}`}
      onMouseMove={handleMouseMove}
      onClick={handleContainerClick}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-chill-blue border-t-transparent"></div>
        </div>
      )}

      <iframe
        ref={iframeRef}
        src={iframeSrc}
        className={`w-full h-full ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title={title}
        onLoad={() => {
          setIsLoading(false);
          setIsPlayerReady(true);
        }}
      />

      {activeMenu === 'subtitle' && <SubtitleMenu />}
      {activeMenu === 'speed' && <PlaybackSpeedMenu />}
      {activeMenu === 'episodes' && isSeries && (
        <EpisodeListMenu 
          episodes={episodes} 
          currentEpisodeId={currentEpisodeId} 
          onEpisodeSelect={onEpisodeChange}
        />
      )}

      {showNextEpisode && <NextEpisodeOverlay nextEpisode={nextEpisode} onSkip={handleNextEpisode} />}

      {showIntroSkip && (
        <button
          onClick={handleSkipIntro}
          className="absolute right-12 bottom-28 z-40 rounded-full bg-white px-6 py-2 text-sm font-semibold text-[#25282B] hover:bg-white/90"
        >
          Lewati Intro
        </button>
    )}

      <PlayerControls 
        isSeries={isSeries} 
        nextEpisode={nextEpisode ? handleNextEpisode : null}
        onPlayPause={handlePlayPause}
        onVolumeChange={handleVolumeChange}
        onSeek={handleSeek}
      />
    </div>
  );
}

export default VideoPlayer;