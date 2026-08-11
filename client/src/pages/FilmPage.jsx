import { useMemo } from 'react';
import { Navbar, Hero, Footer, ContentSection, FilmDetailModal } from '../components';
import { useFilmData } from '../hooks/useFilmData';
import { usePremiumAccess } from '../hooks/usePremiumAccess';
import { useDetailModal } from '../hooks/useDetailModal';

function FilmPage() {
    const { films, loading } = useFilmData({type: 'movie'});
    const { decoratedFilms } = usePremiumAccess(films);
    useDetailModal();

    const allFilms = useMemo(() => {
        if (!decoratedFilms.length) return [];
        return decoratedFilms.filter(
            (item) => item.type === 'movie' || item.duration
        );
    }, [decoratedFilms]);

    const featuredFilm =
        allFilms.find((film) => film.title?.includes('dooms')) || allFilms[0];

    const continueWatchingFilms = useMemo(() => {
        if (!allFilms.length) return [];
        const progressValues = [12, 30, 45, 60, 75, 90];
        return allFilms.slice(0, 10).map((film, index) => ({
            ...film,
            progress: progressValues[index] || 20,
        }));
    }, [allFilms]);

    const popularFilms = useMemo(() => {
        if (!allFilms.length) return [];
        return allFilms
            .filter((film) => film.rating && parseFloat(film.rating) >= 4.5)
            .slice(0, 10);
    }, [allFilms]);

    const topRatingFilms = useMemo(() => {
        if (!allFilms.length) return [];
        return [...allFilms]
            .sort((a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0))
            .slice(0, 10);
    }, [allFilms]);

    const trendingFilms = useMemo(() => {
        if (!allFilms.length) return [];
        return allFilms
            .filter((f) => f.topRank)
            .sort((a, b) => (a.topRank || 999) - (b.topRank || 999))
            .slice(0, 10);
    }, [allFilms]);

    const newReleaseFilms = useMemo(() => {
        if (!allFilms.length) return [];
        return allFilms.filter((film) => film.isNewRelease);
    }, [allFilms]);

    if (loading) {
        return (
            <div className="min-h-screen bg-chill-dark flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-chill-dark">
            <Navbar />
            <Hero featuredFilm={featuredFilm} />
            <main className="bg-chill-dark relative z-20 py-8">
                <div className="space-y-12">
                    <ContentSection
                        title="Melanjutkan Tontonan Film"
                        items={continueWatchingFilms}
                        variant="landscape"
                    />
                    <ContentSection
                        title="Film Populer"
                        items={popularFilms}
                        variant="portrait"
                    />
                    <ContentSection
                        title="Top Rating Film Hari ini"
                        items={topRatingFilms}
                        variant="portrait"
                    />
                    <ContentSection
                        title="Film Trending"
                        items={trendingFilms}
                        variant="portrait"
                    />
                    {newReleaseFilms.length > 0 && (
                        <ContentSection
                            title="Rilis Baru"
                            items={newReleaseFilms}
                            variant="portrait"
                        />
                    )}
                </div>
            </main>
            <Footer />
            <FilmDetailModal />
        </div>
    );
}

export default FilmPage;