import { useMemo } from 'react';
import { Navbar, Hero, Footer, ContentSection, FilmDetailModal } from '../components';
import { useFilmData } from '../hooks/useFilmData';
import { usePremiumAccess } from '../hooks/usePremiumAccess';
import { useDetailModal } from '../hooks/useDetailModal';

function HomePage() {
    const { films, loading } = useFilmData();
    const { decoratedFilms } = usePremiumAccess(films);
    useDetailModal();

    const continueWatching = useMemo(() => {
        if (!decoratedFilms.length) return [];
        return decoratedFilms.slice(0, 6).map((film, idx) => ({
            ...film,
            progress: [12, 30, 45, 60, 75, 90][idx] || 20,
        }));
    }, [decoratedFilms]);

    const topRating = useMemo(() => {
        if (!decoratedFilms.length) return [];
        return [...decoratedFilms]
            .sort((a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0))
            .slice(0, 12);
    }, [decoratedFilms]);

    const trending = useMemo(() => {
        if (!decoratedFilms.length) return [];
        return [...decoratedFilms]
            .filter((f) => f.topRank)
            .sort((a, b) => (a.topRank || 999) - (b.topRank || 999))
            .slice(0, 12);
    }, [decoratedFilms]);

    const newReleases = useMemo(() => {
        if (!decoratedFilms.length) return [];
        return decoratedFilms.filter((f) => f.isNewRelease).slice(0, 12);
    }, [decoratedFilms]);

    const featuredFilm = decoratedFilms.find((f) => f.slug === 'spidey-brand-new-day') || decoratedFilms[0];

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
            <main className="bg-chill-dark relative z-20">
                <ContentSection
                    title="Melanjutkan Tontonan Film dan Series"
                    items={continueWatching}
                    variant="landscape"
                />
                <ContentSection
                    title="Top Rating Film dan Series Hari ini"
                    items={topRating}
                    variant="portrait"
                />
                <ContentSection
                    title="Film dan Series Trending"
                    items={trending}
                    variant="portrait"
                />
                {newReleases.length > 0 && (
                    <ContentSection
                        title="Rilis Baru"
                        items={newReleases}
                        variant="portrait"
                    />
                )}
            </main>
            <Footer />
            <FilmDetailModal />
        </div>
    );
}

export default HomePage;