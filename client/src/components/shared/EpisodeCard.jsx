import Icon from '../ui/Icon';

function EpisodeCard({ episode, seriesTitle, variant = 'default' }) {
  const { thumbnail, title, description, duration } = episode;

  const handlePlayEpisode = () => {
    console.log(`Play ${title} from ${seriesTitle}`);
    // TODO: Navigate to episode player
  };

  if (variant === 'compact') {
    return (
      <div 
        className="group bg-chill-dark-lighter rounded-lg overflow-hidden hover:bg-white/5 transition cursor-pointer"
        onClick={handlePlayEpisode}
      >
        <div className="flex">
          {/* Thumbnail */}
          <div className="relative w-24 h-20 shrink-0">
            <img 
              src={thumbnail || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiMyMDIwMjAiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjNWM2NzcyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBhbGlnbm1lbnQtYmFzZWxpbmU9Im1pZGRsZSI+RXBpc29kZTwvdGV4dD48L3N2Zz4='}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <Icon name="play" className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 mr-2">
                <h4 className="text-white font-medium text-sm mb-1 line-clamp-1">
                  {title}
                </h4>
                <p className="text-white/60 text-xs line-clamp-2 mb-2">
                  {description}
                </p>
              </div>
              <span className="text-white/40 text-xs whitespace-nowrap">
                {duration}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default variant (mobile/expanded)
  return (
    <div 
      className="flex items-center gap-3 p-3 bg-chill-dark-lighter rounded-lg hover:bg-white/5 transition cursor-pointer"
      onClick={handlePlayEpisode}
    >
      {/* Thumbnail */}
      <div className="relative w-16 h-12 shrink-0 rounded overflow-hidden">
        <img 
          src={thumbnail || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiMyMDIwMjAiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjNWM2NzcyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBhbGlnbm1lbnQtYmFzZWxpbmU9Im1pZGRsZSI+RXBpc29kZTwvdGV4dD48L3N2Zz4='}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
            <Icon name="play" className="h-3 w-3 text-white" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1 mr-2">
            <h4 className="text-white font-medium text-sm mb-1 line-clamp-1">
              {title}
            </h4>
            <p className="text-white/60 text-xs line-clamp-2">
              {description}
            </p>
          </div>
          <span className="text-white/40 text-xs whitespace-nowrap">
            {duration}
          </span>
        </div>
      </div>
    </div>
  );
}

export default EpisodeCard;