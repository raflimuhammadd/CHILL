import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Navbar, Footer, MovieCard, FilmDetailModal } from '../components';
import { useSearchContent } from '../hooks/useSearchContent';
import { usePremiumAccess } from '../hooks/usePremiumAccess';
import { useDetailModal } from '../hooks/useDetailModal';
import { contentService } from '../services/contentService';
import Icon from '../components/ui/Icon';


const YEAR_OPTIONS = [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015];
const TYPE_OPTIONS = [
    { value: '', label: 'Semua' },
    { value: 'movie', label: 'Film' },
    { value: 'series', label: 'Series' },
];
const SORT_OPTIONS = [
    { value: '', label: 'Urutkan' },
    { value: 'rating', label: 'Rating tertinggi' },
    { value: 'year', label: 'Tahun terbaru' },
    { value: 'title', label: 'Nama A-Z' },
    { value: 'newest', label: 'Rilis terbaru' },
];

const useGenresInline = () => {
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        contentService
            .getGenres()
            .then((res) => {
                if (!cancelled) setGenres(res?.data || []);
            })
            .catch(() => {
                if (!cancelled) setGenres([]);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => { cancelled = true; };
    }, []);

    return { genres, loading };
};

function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    const { contents, total, loading, error } = useSearchContent();
    const { genres, loading: genresLoading } = useGenresInline();
    const { decoratedFilms } = usePremiumAccess(contents);
    useDetailModal();

    const query = searchParams.get('q') || '';

    const filterCount = Array.from(searchParams.entries())
        .filter(([k]) => k !== 'q').length;

    // ---- param updaters ----
    const handleQueryChange = (e) => {
        const value = e.target.value;
        setSearchParams((prev) => {
            if (value) prev.set('q', value);
            else prev.delete('q');
            return prev;
        });
    };

    const handleFilterChange = (name, value) => {
        setSearchParams((prev) => {
            if (value === '' || value == null) prev.delete(name);
            else prev.set(name, value);
            return prev;
        });
    };

    const handleClearAll = () => {
        setSearchParams({});
    };

    // ---- empty state ----
    const isEmpty = !loading && decoratedFilms.length === 0;

    {!loading && !error && decoratedFilms.length === 0 && (
        <p className="text-center text-gray-500 py-16">
            {query || filterCount > 0
                ? 'Tidak ditemukan hasil untuk pencarian ini.'
                : 'Ketik kata kunci atau pilih filter untuk mulai mencari.'
            }
        </p>
    )}

    return (
        <div className="min-h-screen bg-chill-dark flex flex-col">
            <Navbar />

            {/* Floating centered panel */}
            <div className="max-w-2xl mx-auto mb-10 mt-20">
                <div className="relative rounded-2xl z-100 bg-chill-dark/80 border border-white/10 backdrop-blur-md shadow-2xl p-4 sm:p-6">
                    {/* Search input */}
                    <div className="relative">
                        <input
                            type="search"
                            value={query}
                            onChange={handleQueryChange}
                            placeholder="Cari film atau series..."
                            className="w-full h-12 sm:h-14 pl-11 pr-4 text-base bg-chill-dark/60 border border-white/15 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
                        />
                        <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 stroke-gray-500" />
                    </div>

                    {/* Filters (collapsible optional) */}
                    {query && (
                        <div className="mt-4 flex flex-col md:flex-row gap-3">
                            {/* Type chips */}
                            <div className="flex flex-wrap gap-2">
                                {TYPE_OPTIONS.map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => handleFilterChange('type', opt.value)}
                                        className={`px-3 py-1.5 text-sm rounded-md border transition ${
                                            searchParams.get('type') === opt.value
                                                ? 'bg-red-500 text-white border-red-500'
                                                : 'text-gray-300 border-white/20 hover:bg-white/10'
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>

                            {/* Genre dropdown */}
                            <select
                                value={searchParams.get('genre') || ''}
                                onChange={(e) => handleFilterChange('genre', e.target.value)}
                                className="h-10 px-3 rounded-md bg-chill-dark/60 border border-white/15 text-white text-sm focus:outline-none focus:border-red-500"
                                disabled={genresLoading}
                            >
                                <option value="">Genre</option>
                                {genres.map((g) => (
                                    <option key={g.id} value={g.slug}>{g.name}</option>
                                ))}
                            </select>

                            {/* Year dropdown */}
                            <select
                                value={searchParams.get('year') || ''}
                                onChange={(e) => handleFilterChange('year', e.target.value)}
                                className="h-10 px-3 rounded-md bg-chill-dark/60 border border-white/15 text-white text-sm focus:outline-none focus:border-red-500"
                            >
                                <option value="">Tahun</option>
                                {YEAR_OPTIONS.map((y) => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>

                            {/* Sort dropdown */}
                            <select
                                value={searchParams.get('sort') || ''}
                                onChange={(e) => handleFilterChange('sort', e.target.value)}
                                className="h-10 px-3 rounded-md bg-chill-dark/60 border border-white/15 text-white text-sm focus:outline-none focus:border-red-500"
                            >
                                {SORT_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>

                            {/* Premium toggle */}
                            <button
                                onClick={() =>
                                    handleFilterChange('premium',
                                        searchParams.get('premium') === 'true' ? '' : 'true')
                                }
                                className={`h-10 px-3 rounded-md text-sm border transition ${
                                    searchParams.get('premium') === 'true'
                                        ? 'bg-red-500 text-white border-red-500'
                                        : 'text-gray-300 border-white/20 hover:bg-white/10'
                                }`}
                            >
                                Premium
                            </button>
                        </div>
                    )}

                    {/* Clear all */}
                    {filterCount > 0 && (
                        <button
                            onClick={handleClearAll}
                            className="mt-3 text-xs text-red-400 hover:text-red-300 underline"
                        >
                            Hapus semua filter
                        </button>
                    )}
                </div>
            </div>

            {/* Results */}
            <main className="flex-1 pt-24 pb-16 m-24">
                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white" />
                    </div>
                )}

                {error && (
                    <p className="text-center text-red-400 py-8">
                        Gagal memuat hasil. Coba lagi nanti.
                    </p>
                )}

                {!loading && !error && decoratedFilms.length > 0 && (
                    <>
                    <p className="text-gray-400 text-sm mb-4">
                        Ditemukan {total} hasil
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-24 sm:gap-6">
                        {decoratedFilms.map((film) => (
                            <MovieCard
                                key={film.id}
                                item={film}
                                variant="portrait"
                                progress={0}
                            />
                        ))}
                    </div>
                    </>
                )}

                {!loading && !error && isEmpty && (
                    <p className="text-center text-gray-500 py-16">
                        {query || filterCount > 0
                            ? 'Tidak ditemukan hasil untuk pencarian ini.'
                            : 'Ketik kata kunci atau pilih filter untuk mulai mencari.'}
                    </p>
                )}
            </main>

            <Footer />
            <FilmDetailModal />
        </div>
    );
}

export default SearchPage;