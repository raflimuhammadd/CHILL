import { useEffect, useRef, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import Icon from '../ui/Icon';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import {useFavorites} from '../../hooks/useFavorites';
import filmData from '../../data/filmData';
import RecommendationCard from './RecommendationCard';
import useModalStore from '../../store/modalStore';

function FilmDetailModal() {
  const {isOpen, selectedItem: film, isMobile, closeModal, handleBackdropClick, openModal} = useModalStore();
  const navigate = useNavigate();
  const modalRef = useRef(null);

  const {isFavorite, addToFavorites, removeFromFavorites} = useFavorites();
  const favorited = isFavorite(film?.id);
  const [isMuted, setIsMuted] = useState(true);

  // Focus trap and animation
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
      
      // Add animation class
      setTimeout(() => {
        if (modalRef.current) {
          modalRef.current.classList.add('animate-slide-up');
        }
      }, 10);
    }
  }, [isOpen]);

  if (!isOpen || !film) return null;

  const {
    title,
    rating,
    age,
    duration,
    year,
    genres,
    description,
    cast,
    creator,
    image,
    hoverImage
  } = film;

  // Action handlers
  const handlePlayClick = () => {
      closeModal();
      if (film.isBlocked) {
          navigate(`/watch/${film.id}`);
      }
      navigate(`/watch/${film.id}`);
  };

  const handleFavoriteClick = () => {
    if (favorited) {
      removeFromFavorites(film.id);
    } else {
      addToFavorites(film.id);
    }
  };

  const handleMuteClick = () => {
    setIsMuted(prev => !prev);
    console.log('muted', isMuted);
  };

  const handleRecommendationClick = (recommendedFilm) => {
    if (openModal) {
      openModal(recommendedFilm);
    }
  }

  // Render desktop modal && mobile bottom sheet
  if (isMobile) {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-end"
        onClick={handleBackdropClick}
      >
        <div className="absolute inset-0 bg-black/60" />
        
        {/* bottomsheet */}
        <div 
          ref={modalRef}
          className="relative w-full bg-chill-dark rounded-t-2xl overflow-hidden max-h-[85vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* draghandle */}
          <div className="flex justify-center py-3">
            <div className="w-12 h-1.5 bg-white/30 rounded-full" />
          </div>

          {/* closedbtn */}
          <button
            onClick={closeModal}
            className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition"
            aria-label="Close"
          >
            <Icon name="x" className="h-4 w-4" />
          </button>

          {/* scrollablecontent */}
          <div className="flex-1 overflow-y-auto">
            {/* hero */}
            <div className="relative h-64">
              <img 
                src={hoverImage || image} 
                alt={title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-chill-dark via-chill-dark/50 to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4">
                <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
                <div className="flex items-center gap-3 text-white/80 text-sm">
                  <Badge variant="rating">
                    <Icon name="star" className="h-3 w-3" />
                    <span>{rating}</span>
                  </Badge>
                  <span>{year}</span>
                  <span>{age}</span>
                  <span>{duration}</span>
                </div>
              </div>
            </div>

            {/* actions-btn */}
            <div className="flex items-center justify-center gap-3 px-4 border-b border-white/10">
              <Button 
                variant="primary" 
                size="sm"
                className="flex-1"
                onClick={handlePlayClick}
              >
                <Icon name={film.isBlocked ? 'lock' : 'play'} className="h-4 w-4" />
                {film.isBlocked ? 'Berlangganan Premium' : 'Mulai'}
              </Button>
              <Button 
                variant="secondary" 
                size="icon"
                className="w-9! h-9! p-0!"
                onClick={handleFavoriteClick}
              >
                  <Icon name={favorited ? "check" : "plus"}/>
              </Button>
              <Button 
                variant="secondary" 
                size="icon"
                onClick={handleMuteClick}
                className="w-9! h-9! p-0!"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                <Icon name={isMuted ? 'speaker-x' : 'volume'} className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-4">
              <p className="text-white/80 text-sm mb-4">{description}</p>
              
              {/* metadata */}
              <div className="grid grid-cols-1 gap-4 mb-6">
                <div>
                  <h3 className="text-white/60 text-xs mb-2">Cast</h3>
                  <p className="text-white text-sm">
                    {Array.isArray(cast) ? cast.slice(0, 3).join(', ') : ''}
                  </p>
                </div>
                <div>
                  <h3 className="text-white/60 text-xs mb-2">Creator</h3>
                  <p className="text-white text-sm">{creator}</p>
                </div>
                <div>
                  <h3 className="text-white/60 text-xs mb-2">Genres</h3>
                  <p className="text-white text-sm">
                    {Array.isArray(genres) ? genres.join(', ') : ''}
                  </p>
                </div>
              </div>

                  {film.recommendations && film.recommendations.length > 0 && (
                  <div className="px-4 pb-8">
                    <h2 className="text-xl font-bold text-white mb-4">
                      Rekomendasi Serupa
                    </h2>
                    <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                      {film.recommendations.map((filmId) => {
                        const recommendedFilm = Object.values(filmData).find(f => f.id === filmId);
                        if (!recommendedFilm) return null;

                        return (
                          <RecommendationCard 
                            key={recommendedFilm.id}
                            film={recommendedFilm}
                            onSelect={handleRecommendationClick}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // dekstop-modal
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* backdrop-blur */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      
      {/* modal */}
      <div 
        ref={modalRef}
        className="relative w-full max-w-4xl bg-chill-dark rounded-xl overflow-hidden shadow-2xl max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        {/* Closed-btn */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition"
          aria-label="Close"
        >
          <Icon name="x" className="h-5 w-5" />
        </button>

        <div className="hero-section relative h-72">
          <img 
            src={hoverImage || image} 
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-chill-dark via-chill-dark/60 to-transparent" />
          
          <div className="absolute bottom-6 left-6 right-6">
            <h1 className="text-3xl font-bold text-white">{title}</h1>

            <div className="mt-6 flex items-center justify-between">
              {/* leftgrp-btn */}
              <div className="flex items-center gap-3">
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={handlePlayClick}
                >
                  <Icon name="play"/>
                  Mulai
                </Button>
                <Button 
                  variant="secondary" 
                  size="icon"
                  onClick={handleFavoriteClick}
                  aria-label={favorited ? "Remove from MyList" : "Add to MyList"}
                >
                  <Icon name={favorited ? "check" : "plus"}/>
                </Button>
              </div>

              {/* right-btn */}
              <div>
                <Button 
                  variant="secondary" 
                  size="icon"
                  onClick={handleMuteClick}
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  <Icon name={isMuted ? "speaker-x" : "volume"}/>
                </Button>
              </div>
            </div>
          </div>


        </div>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">

          <div className="mb-6 flex items-center gap-3 text-sm text-white/70">
            <Icon name="star" className="h-3 w-3 mr-0" />
            <span>{rating}</span>
            <span className="h-1 w-1 rounded-full bg-white/30" />
            <span>{year}</span>
            <span className="h-1 w-1 rounded-full bg-white/30" />
            <span>{duration}</span>
            <span className="h-1 w-1 rounded-full bg-white/30" />
            <span>{age}</span>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <h2 className="left-column-content text-white font-bold text-lg mb-3">Sinopsis</h2>
              <p className="text-white/80 text-base mb-6">{description}</p>
            </div>

            <div className="right-column-content space-y-4">
              <div>
                <h3 className="text-white/60 text-sm mb-2">Cast</h3>
                <p className="text-white text-base">
                  {Array.isArray(cast) ? cast.slice(0, 4).join(', ') : ''}
                </p>
              </div>
              <div>
                <h3 className="text-white/60 text-sm mb-2">Creator</h3>
                <p className="text-white text-base">{creator}</p>
              </div>
              <div>
                <h3 className="text-white/60 text-sm mb-2">Genres</h3>
                <p className="text-white text-base">
                  {Array.isArray(genres) ? genres.join(', ') : ''}
                </p>
              </div>
            </div>
          </div>

              {film.recommendations && film.recommendations.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Rekomendasi Serupa
                </h2>
                <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                  {film.recommendations.map((filmId) => {
                    const recommendedFilm = Object.values(filmData).find(f => f.id === filmId);
                    if (!recommendedFilm) return null;

                    return (
                      <RecommendationCard 
                        key={recommendedFilm.id}
                        film={recommendedFilm}
                        onSelect={handleRecommendationClick}
                      />
                    )
                  })}
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
export default FilmDetailModal;