import {Navbar, Hero, Footer} from '../components';
import {ContentSection, FilmDetailModal} from '../components';
import filmData from '../data/filmData';
import {useDetailModal} from '../hooks/useDetailModal';


function FilmPage() {
    useDetailModal();
    // convert data object to arrray
    const allFilms = Object.values(filmData);

    // filter film only (ambil yg ada totalScreen)
    const isFilm = (item) => item.duration !== undefined;

    const items = allFilms.filter(isFilm);

    // used to hero series
    const featuredFilms = items.find(film => film.title.includes('Avatar')) || items[0];

    // section 1: LanjutTontonan
    const progressValues = [12, 30, 45, 60, 75, 90];
    const continueWatchingFilms = items.slice(0, 10).map((film, index) => ({
        ...film,
        progress: progressValues[index] || 20
    }));

    // section 2: Top Rating
    const popularFilms = items
        .filter(film => film.rating && parseFloat(film.rating))
        .slice(0, 10);

    // section 3: TopRating
    const topRatingFilms = items
        .slice()
        .sort((a, b) => {
            const aRating = parseFloat(a.rating);
            const bRating = parseFloat(b.rating);
            return bRating - aRating;
        })
        .slice(0, 10);

    // section 4: Trending
    const trendingFilms = items
        .filter(s => s.topRank)
        .sort((a, b) => (a.topRank || 999) - (b.topRank || 999))
        .slice(0, 10);

    // section 5: Genre
    const newReleaseFilms = items.filter((film) => film.isNewRelease);

    return (
        <div className="min-h-screen bg-chill-dark">
            <Navbar />

            <Hero featuredFilm={featuredFilms} />

            <main className="bg-chill-dark relative z-20 py-8">
                <div className="space-y-12">
                    {/* section1: landscape */}
                    <ContentSection 
                        title="Melanjutkan Tontonan Film"
                        items={continueWatchingFilms}
                        variant="landscape"
                    />

                    {/* section2: portrait */}
                    <ContentSection 
                        title="Film Populer"
                        items={popularFilms}
                        variant="portrait"
                    />

                    {/* section3: portrait */}
                    <ContentSection 
                        title="Top Rating Film Hari ini"
                        items={topRatingFilms}
                        variant="portrait"
                    />

                    {/* section4: portrait */}
                    <ContentSection 
                        title="Film Trending"
                        items={trendingFilms}
                        variant="portrait"
                    />

                    {/* section5: genre */}
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

            {/* Film Detail Modal */}
            <FilmDetailModal />
        </div>
    )
}

export default FilmPage;