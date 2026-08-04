import { playerStore } from '../store/playerStore';

function PlaybackSpeedMenu() {
  const { playbackRate, closeMenu, setPlaybackRate } = playerStore();
  const speeds = [0.5, 0.75, 1, 1.25, 1.5];

  return (
    <div className="fixed bottom-4 right-4 z-50 w-24 bg-gray-900/95 backdrop-blur-md rounded-lg p-2 shadow-2xl animate-slide-up">
      {speeds.map((speed) => (
        <button
          key={speed}
          onClick={() => setPlaybackRate(speed)}
          className={`
            flex items-center justify-between w-full px-3 py-2 rounded
            hover:bg-white/10 transition-colors text-white/80 text-sm
            ${playbackRate === speed ? 'bg-white/10' : ''}
          `}
        >
          <span>{speed}x</span>
          {playbackRate === speed && (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </button>
      ))}
      <button
        onClick={closeMenu}
        className="w-full py-2 text-center text-white/60 hover:text-white text-sm mt-2"
      >
        Tutup
      </button>
    </div>
  );
}

export default PlaybackSpeedMenu;
