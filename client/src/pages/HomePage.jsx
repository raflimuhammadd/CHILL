import {Navbar, Hero, Footer} from '../components';
import filmData from '../data/filmData';
import {ContentSection, FilmDetailModal} from '../components';
import {useDetailModal} from '../hooks/useDetailModal';

function HomePage() {
    const featuredFilm = filmData['card-duty'];
    useDetailModal();

    // section 1
    const continueWatching = [
        filmData['card-dont-look'],
        filmData['card-batman'],
        filmData['card-blue-lock'],
        filmData['card-otto'],
        filmData['card-ted-lasso'],
        filmData['card-guardian'],
        filmData['card-quantumania']
    ]

    // Section 2: Top Rating (Portrait)
    const topRating = [
        filmData['card-suzume'],
        filmData['card-jurassic'],
        filmData['card-my-perfect'],
        filmData['card-alice'],
        filmData['card-megan'],
        filmData['card-mermaid'],
        filmData['card-quantumania'],
        filmData['card-sonic-2'],
        filmData['card-happiness'],
        filmData['card-stuart'],
        filmData['card-rio'],
        filmData['card-big-hero-6'],
        filmData['card-tomorrow']
    ];

    // Section 3: Film Trending (Portrait)
    const trending = [
        filmData['card-duty'],
        filmData['card-avatar-2'],
        filmData['card-fast-x'],
        filmData['card-miles'],
        filmData['card-quantumania'],
        filmData['card-sonic-2'],
        filmData['card-quantumania'],
        filmData['card-sonic-2'],
        filmData['card-happiness'],
        filmData['card-stuart'],
        filmData['card-rio'],
        filmData['card-big-hero-6'],
        filmData['card-tomorrow']
    ];

    // Section 4: Rilis Baru (Portrait)
    const newReleases = [
        filmData['card-happiness'],
        filmData['card-stuart'],
        filmData['card-rio'],
        filmData['card-big-hero-6'],
        filmData['card-tomorrow'],
        filmData['card-suzume'],
        filmData['card-quantumania'],
        filmData['card-sonic-2'],
        filmData['card-happiness'],
        filmData['card-stuart'],
        filmData['card-rio'],
        filmData['card-big-hero-6'],
        filmData['card-tomorrow']
    ];


    return (
        <div className="min-h-screen bg-chill-dark">
            <Navbar />

            <Hero featuredFilm={featuredFilm}/>

            {/* content */}
            <main className="bg-chill-dark relative z-20">
                {/* section 1 */}
                <ContentSection 
                    title="Melanjutkan Tontonan Film dan Series"
                    films={continueWatching}
                    variant='landscape'
                />

                {/* section 2 */}
                <ContentSection 
                    title="Top Rating Film dan Series Hari ini"
                    films={topRating}
                    variant='portrait'
                />

                {/* section 3 */}
                <ContentSection 
                    title="Film dan Series Trending"
                    films={trending}
                    variant='portrait'
                />

                {/* section 4 */}
                <ContentSection 
                    title="Rilis Baru"
                    films={newReleases}
                    variant='portrait'
                />
            </main>
            <Footer />

            <FilmDetailModal />
        </div>
    )
}

export default HomePage;