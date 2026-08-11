import { useMemo } from 'react';
import { Navbar, Hero, Footer, ContentSection, SeriesDetailModal } from '../components';
import { useFilmData } from '../hooks/useFilmData';
import { usePremiumAccess } from '../hooks/usePremiumAccess';
import { useDetailModal } from '../hooks/useDetailModal';

function SeriesPage() {
    const { films, loading } = useFilmData({type: 'series'});
    const { decoratedFilms } = usePremiumAccess(films);
    useDetailModal();

    const allSeries = useMemo(() => {
        if (!decoratedFilms.length) return [];
        return decoratedFilms.filter(
            (item) => item.type === 'series' || item.totalEpisodes > 0
        );
    }, [decoratedFilms]);

    const featuredSeries =
        allSeries.find((s) => s.title?.includes('Happiness')) || allSeries[0];

    const continueWatchingSeries = useMemo(() => {
        if (!allSeries.length) return [];
        const progressValues = [12, 30, 45, 60, 75, 90];
        return allSeries.slice(0, 10).map((film, index) => ({
            ...film,
            progress: progressValues[index] || 20,
        }));
    }, [allSeries]);

    const popularSeries = useMemo(() => {
        if (!allSeries.length) return [];
        return allSeries
            .filter((s) => s.rating && parseFloat(s.rating) >= 4.5)
            .slice(0, 10);
    }, [allSeries]);

    const topRatingSeries = useMemo(() => {
        if (!allSeries.length) return [];
        return [...allSeries]
            .sort((a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0))
            .slice(0, 10);
    }, [allSeries]);

    const trendingSeries = useMemo(() => {
        if (!allSeries.length) return [];
        return allSeries
            .filter((s) => s.topRank)
            .sort((a, b) => (a.topRank || 999) - (b.topRank || 999))
            .slice(0, 10);
    }, [allSeries]);

    const newReleaseSeries = useMemo(() => {
        if (!allSeries.length) return [];
        return allSeries.filter((s) => s.isNewRelease);
    }, [allSeries]);

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
            <Hero featuredFilm={featuredSeries} />
            <main className="bg-chill-dark relative z-20 py-8">
                <div className="space-y-12">
                    <ContentSection
                        title="Melanjutkan Tontonan Series"
                        items={continueWatchingSeries}
                        variant="landscape"
                    />
                    <ContentSection
                        title="Series Populer"
                        items={popularSeries}
                        variant="portrait"
                    />
                    <ContentSection
                        title="Top Rating Series Hari ini"
                        items={topRatingSeries}
                        variant="portrait"
                    />
                    <ContentSection
                        title="Series Trending"
                        items={trendingSeries}
                        variant="portrait"
                    />
                    {newReleaseSeries.length > 0 && (
                        <ContentSection
                            title="Rilis Baru"
                            items={newReleaseSeries}
                            variant="portrait"
                        />
                    )}
                </div>
            </main>
            <Footer />
            <SeriesDetailModal />
        </div>
    );
}

export default SeriesPage;