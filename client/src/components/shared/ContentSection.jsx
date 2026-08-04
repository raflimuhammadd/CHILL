import { useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import MovieCard from './MovieCard';
import ScrollButtons from './ScrollButtons';

function ContentSection({ title, films, items, variant = 'portrait' }) {
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  // Deterministic progress generation using film ID as seed
  const itemsData = films || items;
  
  const filmsWithProgress = useMemo(() => {
    if (!itemsData || itemsData.length === 0) return [];

    return itemsData.map((film) => {
      if (variant === 'landscape') {
        // Deterministic seed from film ID
        const seed = film.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const progress = (seed % 70) + 15; // 15-85% range
        return { ...film, progress };
      }
      return film;
    });
  }, [itemsData, variant]);

  if (!itemsData || itemsData.length === 0) return null;

  const handleViewAll = () => {
    const routeMap = {
      'Melanjutkan Tontonan': '/continue-watching',
      'Top Rating Film dan Series Hari ini': '/top-rating',
      'Film Trending': '/trending',
      'Rilis Baru': '/new-releases'
    };
    navigate(routeMap[title] || '/');
  };

  return (
    <section className="content-section py-4 xs:py-5 sm:py-6 md:py-8, gap-3 xs:gap-4 sm:gap-5 md:gap-6">
      <div className="content-section-container container-responsive">
        <div className="content-section-header flex justify-between items-center mb-8">
          <h2 className="content-section-title text-xl xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-white">{title}</h2>
          <button
            onClick={handleViewAll}
            className="content-section-view-all text-blue-500 hover:text-blue-400 transition flex items-center gap-1 text-sm md:text-base"
          >
            Lihat Semua
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>

        <div className="content-section-carousel relative">
          <ScrollButtons 
              scrollRef={scrollRef}
              direction="left"
              className="left-2"
          />

          <div ref={scrollRef} className={`content-section-cards-wrapper 
                flex ${title === 'Melanjutkan Tontonan' ? 'gap-6' : 'gap-4'} 
                overflow-x-auto overflow-y-hidden scrollbar-hide pb-4`}>
            {filmsWithProgress.map((film) => (
              <MovieCard
                key={film.id}
                item={film}
                variant={variant}
                progress={film.progress}
                showNewEpisode={film.hasNewEpisode}
              />
            ))}
          </div>

            <ScrollButtons 
              scrollRef={scrollRef}
              direction="right"
              className="right-2"
            />

        </div>
      </div>
    </section>
  );
}

export default ContentSection;