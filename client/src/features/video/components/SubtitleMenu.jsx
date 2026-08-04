import { playerStore } from '../store/playerStore';

function SubtitleMenu() {
  const { closeMenu, selectedAudio, selectedSubtitle, setSelectedSubtitle, setSelectedAudio } = playerStore();

  const subtitles = [
    { id: 'off', label: 'No Subtitles'},
    { id: 'id', label: 'Bahasa Indonesia'},
    { id: 'en', label: 'Bahasa Inggris'}
  ];

  const audios = [
    { id: 'id', label: 'Bahasa Indonesia'},
    { id: 'en', label: 'Bahasa Inggris'}
  ];


return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 translate-y-24 z-50 w-[90%] md:w-2/3 max-w-2xl">
      <div className="bg-gray-900/95 backdrop-blur-md rounded-lg p-4 shadow-2xl animate-slide-up">
        <div className="flex justify-between mb-4">
          <div className="flex-1 mr-2">
            <h3 className="text-white text-sm font-semibold mb-2">Audio</h3>
            <div className="space-y-1">
              {audios.map((audio) => {
                const isActive = audio.id === selectedAudio;
                return (
                  <button
                    key={audio.id}
                    onClick={() => {
                      setSelectedAudio(audio.id);  // ✅ SET STATE
                      closeMenu();
                    }}
                    className="flex items-center gap-2 w-full text-left px-3 py-2 rounded hover:bg-white/10 transition-colors text-white/80"
                  >
                    {isActive && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                    <span className={isActive ? 'text-white font-medium' : ''}>{audio.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex-1 ml-2">
            <h3 className="text-white text-sm font-semibold mb-2">Terjemahan</h3>
            <div className="space-y-1">
              {subtitles.map((sub) => {
                const isActive = sub.id === selectedSubtitle;
                return (
                  <button
                    key={sub.id}
                    onClick={() => {
                      setSelectedSubtitle(sub.id);
                      closeMenu();
                    }}
                    className="flex items-center gap-2 w-full text-left px-3 py-2 rounded hover:bg-white/10 transition-colors text-white/80"
                  >
                    {isActive && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                    <span className={isActive ? 'text-white font-medium' : ''}>{sub.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <button
          onClick={closeMenu}
          className="w-full py-2 text-white/60 hover:text-white text-sm"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}

export default SubtitleMenu;
