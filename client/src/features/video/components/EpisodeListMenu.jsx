import { playerStore } from '../store/playerStore';
import Icon from '../../../components/ui/Icon';

function EpisodeListMenu({ episodes = [], currentEpisodeId, onEpisodeSelect }) {
  const { closeMenu } = playerStore();

  return (
    <div className="absolute right-12 bottom-24 z-50 w-115 overflow-hidden rounded-md bg-[#252B2A]/95 text-white shadow-2xl backdrop-blur-md">
      <button
        onClick={closeMenu}
        className="flex w-full items-center gap-2 bg-[#3C4241] px-4 py-3 text-left text-base font-semibold hover:bg-[#464C4B]"
      >
        <span className="text-xl leading-none">←</span>
        <span>Episode Selanjutnya</span>
      </button>

      <div>
        {episodes.map((ep) => {
          const isActive = ep.id === currentEpisodeId;
          const nextEpisode = ep.id === currentEpisodeId + 1;
          const expanded = isActive || nextEpisode;

          return (
            <button
              key={ep.id}
              onClick={() => {
                onEpisodeSelect(ep.id);
                closeMenu();
              }}
              className={`w-full text-left transition-colors ${
                isActive ? 'bg-[#3C4241]' : 'bg-[#252B2A] hover:bg-[#343A39]'
              }`}
            >
              <div className="px-4 py-3 text-base font-semibold">
                Episode {ep.id}
              </div>

              {expanded && (
                <div className="flex gap-3 px-4 pb-4">
                  <div className="h-24 w-40 shrink-0 overflow-hidden rounded">
                    <img
                      src={ep.thumbnail}
                      alt={ep.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-3 flex items-center gap-2">
                      <h4 className="truncate text-sm font-semibold text-white">
                        {ep.title}
                      </h4>
                      {isActive && <Icon name="activeDot" />}
                    </div>
                    <p className="line-clamp-3 text-sm leading-6 text-white/80">
                      {ep.description}
                    </p>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default EpisodeListMenu;