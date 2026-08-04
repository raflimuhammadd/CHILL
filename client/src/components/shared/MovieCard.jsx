import { useState } from 'react';
import { useFavorites } from '../../hooks/useFavorites';
import Icon from '../ui/Icon';
import Badge from '../ui/Badge';
import HoverOverlay from './HoverOverlay';
import HoverOverlayLandscape from './HoverOverlayLandscape';
import useModalStore from '../../store/modalStore';
import useEditModalStore from '../../store/editModalStore';

function MovieCard({ item, variant = 'portrait', progress, showNewEpisode = false, hoverVariant }) {
  const { removeFromFavorites } = useFavorites();
  const {isMobile, openModal} = useModalStore();
  const [showActions, setShowActions] = useState(false);
  const {openEditModal} = useEditModalStore();

  if (!item) return null;
  const displayProgress = progress;
  const isMyListCard = hoverVariant === 'mylist';

    const handleSelect = () => {
      if (isMobile) {
        if (isMyListCard) {
          setShowActions(true);
        } else {
          openModal(item);
        }
      }
  };

  const handleCloseOverlay = () => {
    setShowActions(false);
  };

  const handlePlay = (e) => {
    e.stopPropagation();
    openModal(item);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    removeFromFavorites(item.id);
    handleCloseOverlay();
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    openEditModal(item);
    handleCloseOverlay();
  };

  if (variant === 'portrait') {
    return (
      <article onClick={handleSelect} 
            className={`movie-card movie-card-portrait shrink-0 group cursor-pointer
                    ${isMyListCard
                      ? 'w-full max-w-45 sm:w-44 md:w-52 lg:w-58.5'
                      : 'w-30 xs:w-[140px] sm:w-44 md:w-52 lg:w-58.5'
                    }`}
          >
            
        <div className="movie-card-image-wrapper relative aspect-2/3 rounded-lg overflow-hidden mb-2">
          <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.08]" />
          {/* Top-left: Premium OR Episode Baru */}
            {item.isPremium ? (
              <Badge variant="premium" className="movie-card-badge movie-card-badge-premium top-2 left-2">Premium</Badge>
            ) : showNewEpisode && (
              <Badge variant="episode" className="movie-card-badge movie-card-badge-episode top-2 left-2">Episode Baru</Badge>
            )}
            {/* Top-right: Top 10 */}
            {item.topRank && (
              <Badge variant="top10" className="top-0 right-2">
                TOP<br />{item.topRank}
              </Badge>
            )}

            {/* Bottom-left: Rating */}
            {item.rating && (
              <Badge variant="rating" className="bottom-2 left-2">
                <Icon name="star" className="h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4" />
                <span>{item.rating}</span>
              </Badge>
            )}
            {(!isMobile || hoverVariant !== 'mylist') && (
              <HoverOverlay film={item} variant={hoverVariant || 'default'} />
            )}

            {/* Mobile actions overlay - inside poster wrapper */}
            {isMobile && showActions && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-lg backdrop-blur-xs bg-black/70">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCloseOverlay();
                  }}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center"
                  aria-label="Close"
                >
                  <Icon name="x" className="h-4 w-4 text-white" />
                </button>

                <div className="flex flex-col items-center gap-5">
                  <button
                    onClick={handlePlay}
                    className="bg-white text-black rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
                    aria-label="Play"
                  >
                    <Icon name="play" className="h-7 w-7" />
                  </button>

                  <button
                    onClick={handleDelete}
                    className="bg-transparent border-2 border-gray-300 text-gray-200 rounded-full w-12 h-12 flex items-center justify-center"
                    aria-label="Remove"
                  >
                    <Icon name="delete" className="h-5 w-5" />
                  </button>

                  <button
                    onClick={handleEditClick}
                    className="bg-transparent border-2 border-gray-300 text-gray-200 rounded-full w-12 h-12 flex items-center justify-center"
                    aria-label="Edit"
                  >
                    <Icon name="update" className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
        </div>

        {/* Card Info Section */}
        {isMyListCard ? (
          <div className="mt-2 px-1">
            {/* Title */}
            <h3 className="text-white text-sm sm:text-base font-semibold truncate mb-1">
              {item.title}
            </h3>
            {/* Year + Episodes row */}
            <div className="flex items-center justify-between text-xs sm:text-sm text-white/60">
              <span>{item.year}</span>
              <span>{item.episodes || item.duration}</span>
            </div>
          </div>
        ) : (
          <h3 className="movie-card-title text-white text-xs xs:text-sm sm:text-base font-medium truncate text-center mt-2">
            {item.title}
          </h3>
        )}
        
        {/* <h3 className="movie-card-title text-white text-xs xs:text-sm sm:text-base font-medium truncate text-center">
          {item.title}
        </h3> */}


      </article>
    );
  }

  return (
    <article onClick={handleSelect} className="movie-card movie-card--landscape shrink-0 w-50 xs:w-[220px] sm:w-64 md:w-72 lg:w-80 xl:w-[320px] group cursor-pointer">
      <div className="movie-card-image-wrapper relative aspect-video rounded-lg overflow-hidden mb-2">
        <img 
          src={item.hoverImage} 
          alt={item.title} 
          className="movie-card-image w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
        />
        
        {showNewEpisode && (
          <Badge 
            variant="episode" 
            className="movie-card-badge top-2 left-2 group-hover:opacity-0 group-hover:invisible transition-all duration-200"
          >
            Episode Baru
          </Badge>
        )}
        
        <div className="movie-card-progress absolute bottom-0 left-0 right-0
              h-1 bg-gray-800 group-hover:opacity-0 group-hover:invisible transition-all
              duration-200">
            <div className="movie-card-progress-fill h-full bg-red-600
                  transition-all duration-300" 
                  style={{width: `${displayProgress}%`}}
                />
        </div>
        <HoverOverlayLandscape film={item} />

      </div>
      
      <h3 className="movie-card-title text-white text-xs xs:text-sm sm:text-base font-medium truncate">
        {item.title}
      </h3>
    </article>
  );
}
export default MovieCard;