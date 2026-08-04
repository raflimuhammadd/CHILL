import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navbar, Footer } from '../components';
import {
    fetchWatchHistory,
    addWatchHistoryItem,
    editWatchHistoryItem,
    deleteWatchHistoryItem,
} from '../store/redux/slices/watchHistorySlice';
import {filmData} from '../data/filmData';
import useAuthStore from '../features/auth/store/authStore';

const allFilms = Object.values(filmData);

const statusOptions = [
    { value: 'watching', label: 'Sedang Ditonton', color: 'text-blue-400' },
    { value: 'completed', label: 'Selesai', color: 'text-green-400' },
    { value: 'on_hold', label: 'Ditunda', color: 'text-yellow-400' },
];

function WatchHistoryPage() {
    const dispatch = useDispatch();
    const {items, loading, error} = useSelector((state) => state.watchHistory);
    const user = useAuthStore((state) => state.user);

    const [activeTab, setActiveTab] = useState('all');

    const [form, setForm] = useState({
        title: '',
        poster: '',
        status: 'watching',
        currentEpisode: 1,
        totalEpisodes: 1,
        rating: 7,
        note: '',
    });

    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [isSeries, setIsSeries] = useState(false);

    useEffect(() => {
        if (user?.id) {
            dispatch(fetchWatchHistory(user.id));
        }
    }, [dispatch, user?.id]);

    const handleFilmSelect = (e) => {
        const filmId = e.target.value;
        const film = allFilms.find((f) => f.id === filmId);
        if (film) {
            const isSeriesFilm = Array.isArray(film.episodesList);
            setIsSeries(isSeriesFilm);
            setForm({
                ...form,
                filmId: film.id,
                title: film.title,
                poster: film.image || '',
                totalEpisodes: isSeriesFilm ? film.episodes.length : 1,
                currentEpisode: isSeriesFilm ? 1 : 1,
            });
        }
    };

    const handleAdd = () => {
        if (!form.filmId || !form.title) return;

        const alreadyExists = items.some((item) => item.filmId === form.filmId);
        if (alreadyExists) {
            alert('Film sudah ada dalam history');
            return;
        }

        dispatch(addWatchHistoryItem({
            ...form,
            userId: user.id,
            watchedAt: new Date().toISOString(),
        }));
        setForm({
            filmId: '',
            title: '',
            poster: '',
            status: 'watching',
            currentEpisode: 1,
            totalEpisodes: 1,
            rating: 7,
            note: '',
        });
    };

        const startEdit = (item) => {
        setEditingId(item.id);
        setEditForm({ ...item });
    };

        const handleSaveEdit = () => {
            dispatch(editWatchHistoryItem({
                id: editingId,
                historyData: editForm,
            }));
            setEditingId(null);
            setEditForm({});
        };

        const handleCancelEdit = () => {
            setEditingId(null);
            setEditForm({});
        };

         const handleDelete = (id) => {
        if (window.confirm('Hapus item ini dari watch history?')) {
            dispatch(deleteWatchHistoryItem(id));
        }
    };

        const filteredItems = activeTab === 'all'
            ? items
            : items.filter((item) => item.status === activeTab);

        // ── Status badge helper ──
        const getStatusBadge = (status) => {
            const option = statusOptions.find((o) => o.value === status);
            return option || statusOptions[0];
        };

        return (
        <div className="min-h-screen bg-chill-dark text-white">
            <Navbar />

            <main className="container-responsive pt-28 md:pt-32 pb-16">
                {/* ── Header ── */}
                <div className="mb-10">
                    <h1 className="text-3xl md:text-5xl font-bold mb-3">
                        Watch History
                    </h1>
                    <p className="text-white/60 text-base md:text-lg">
                        Kelola daftar tontonanmu. Data tersimpan di{' '}
                        <span className="text-blue-400 font-medium">MockAPI</span>{' '}
                        menggunakan{' '}
                        <span className="text-blue-400 font-medium">Redux Toolkit</span>
                    </p>
                    <p className="font-bold">Implementasi CRUD</p>
                </div>

                {/* ── Form Tambah ── */}
                <div className="bg-white/5 rounded-xl p-6 mb-8">
                    <h2 className="text-lg font-semibold mb-4">Tambah ke Watch History</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Pilih Film */}
                        <div>
                            <label className="block text-sm text-white/60 mb-1">
                                Pilih Film
                            </label>
                            <select
                                value={form.filmId}
                                onChange={handleFilmSelect}
                                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm"
                            >
                                <option value="">-- Pilih Film --</option>
                                {allFilms.map((film) => (
                                    <option key={film.id} value={film.id}>
                                        {film.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm text-white/60 mb-1">
                                Status
                            </label>
                            <select
                                value={form.status}
                                onChange={(e) => setForm({ ...form, status: e.target.value })}
                                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm"
                            >
                                {statusOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Episode Saat Ini */}
                        <div>
                            <label className="block text-sm text-white/60 mb-1">
                                Episode Saat Ini
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={form.currentEpisode}
                                onChange={(e) => setForm({
                                    ...form,
                                    currentEpisode: parseInt(e.target.value) || 1,
                                })}
                                disabled={!isSeries}
                                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 
                                py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                            />
                        </div>

                        {/* Rating */}
                        <div>
                            <label className="block text-sm text-white/60 mb-1">
                                Rating (1-10)
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="10"
                                value={form.rating}
                                onChange={(e) => {
                                    const raw = e.target.value;
                                    if (raw === ''){
                                        setForm({...form, rating: ''});
                                        return;
                                    }
                                    setForm({...form, rating: parseInt(raw, 10)});
                                }}
                                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm"
                            />
                        </div>

                        {/* Catatan */}
                        <div className="md:col-span-2">
                            <label className="block text-sm text-white/60 mb-1">
                                Catatan
                            </label>
                            <input
                                type="text"
                                value={form.note}
                                onChange={(e) => setForm({ ...form, note: e.target.value })}
                                placeholder="Tulis catatan tentang film ini..."
                                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm"
                            />
                        </div>
                    </div>

                    {/* Tombol Tambah */}
                    <button
                        onClick={handleAdd}
                        disabled={!form.filmId}
                        className="mt-4 px-6 py-2 bg-[#0586FF] hover:bg-[#0367DB] active:bg-[#024DB7] disabled:bg-white/10
                                   disabled:text-white/40 rounded-lg text-sm font-medium transition-colors"
                    >
                        + Tambah
                    </button>
                </div>

                {/* ── Filter Tabs ── */}
                <div className="flex gap-4 border-b border-white/10 mb-6">
                    {[
                        { key: 'all', label: 'Semua' },
                        { key: 'watching', label: 'Sedang Ditonton' },
                        { key: 'completed', label: 'Selesai' },
                        { key: 'on_hold', label: 'Ditunda' },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`pb-3 px-2 text-sm font-medium transition-colors ${
                                activeTab === tab.key
                                    ? 'text-white border-b-2 border-[#0586FF]'
                                    : 'text-white/40 hover:text-white/60'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* ── Loading ── */}
                {loading && (
                    <div className="flex items-center gap-3 bg-white/5 rounded-xl p-6 mb-6">
                        <div className="animate-spin h-6 w-6 border-2 border-[#0586FF] border-t-transparent rounded-full" />
                        <span className="text-white/70">Memuat data...</span>
                    </div>
                )}

                {/* ── Error ── */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-6">
                        <p className="text-red-400 font-medium">Gagal memuat data</p>
                        <p className="text-red-400/70 text-sm mt-1">{error}</p>
                    </div>
                )}

                {/* ── Items Grid ── */}
                {!loading && !error && filteredItems.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {filteredItems.map((item) => {
                            const status = getStatusBadge(item.status);
                            const isEditing = editingId === item.id;

                            return (
                                <div
                                    key={item.id}
                                    className="bg-white/5 rounded-xl overflow-hidden
                                               hover:bg-white/10 transition-colors"
                                >
                                    {/* Poster */}
                                    <img
                                        src={item.poster || '/assets/images/profile.png'}
                                        alt={item.title}
                                        className="w-full h-40 object-cover"
                                    />

                                    <div className="p-4">
                                        {/* Title */}
                                        <p className="font-medium text-sm mb-1 truncate">
                                            {item.title}
                                        </p>

                                        {/* Status Badge */}
                                        <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full bg-white/10 ${status.color}`}>
                                            {status.label}
                                        </span>

                                        {/* Rating */}
                                        <p className="text-yellow-400 text-xs mt-2">
                                            ⭐ {item.rating}/10
                                        </p>

                                        {/* Episode */}
                                        <p className="text-white/50 text-xs mt-1">
                                            Ep {item.currentEpisode}/{item.totalEpisodes}
                                        </p>

                                        {/* Note */}
                                        {item.note && (
                                            <p className="text-white/40 text-xs mt-1 italic truncate">
                                                "{item.note}"
                                            </p>
                                        )}

                                        {/* ── Edit Mode ── */}
                                        {isEditing ? (
                                            <div className="mt-3 space-y-2">
                                                <select
                                                    value={(e) => {
                                                        const raw = e.target.value;
                                                        if (raw === '') {
                                                            setEditForm({...editForm, rating: ''});
                                                            return;
                                                        }
                                                        setEditForm({...editForm, rating: parseInt(raw, 10)});
                                                    }}
                                                    className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-xs"
                                                >
                                                    {statusOptions.map((opt) => (
                                                        <option key={opt.value} value={opt.value}>
                                                            {opt.label}
                                                        </option>
                                                    ))}
                                                </select>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="10"
                                                    value={editForm.rating}
                                                    onChange={(e) => setEditForm({
                                                        ...editForm,
                                                        rating: parseInt(e.target.value) || 7,
                                                    })}
                                                    className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-xs"
                                                />
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={handleSaveEdit}
                                                        className="flex-1 text-xs bg-green-600 hover:bg-green-700 rounded py-1"
                                                    >
                                                        Simpan
                                                    </button>
                                                    <button
                                                        onClick={handleCancelEdit}
                                                        className="flex-1 text-xs bg-white/10 hover:bg-white/20 rounded py-1"
                                                    >
                                                        Batal
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            /* ── Action Buttons ── */
                                            <div className="flex gap-2 mt-3">
                                                <button
                                                    onClick={() => startEdit(item)}
                                                    className="flex-1 text-xs bg-blue-500/20 text-blue-400
                                                               hover:bg-blue-500/30 rounded py-1 transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="flex-1 text-xs bg-red-500/20 text-red-400
                                                               hover:bg-red-500/30 rounded py-1 transition-colors"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ── Empty State ── */}
                {!loading && !error && filteredItems.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-white/40 text-lg">
                            Belum ada watch history.
                        </p>
                        <p className="text-white/30 text-sm mt-2">
                            Pilih film di atas untuk mulai menambahkan.
                        </p>
                    </div>
                )}

                {/* ── Redux Info Box ── */}
                <div className="mt-8 bg-[#3D4142] border border-[#192DB7] rounded-xl p-5">
                    <p className="text-[#E7E3FCDE] font-medium text-sm mb-2">
                        Cara Kerja Redux di Halaman Ini:
                    </p>
                    <ul className="text-[#E7E3FCDE] text-sm space-y-1">
                        <li>1. Component mount → dispatch(fetchWatchHistory(userId))</li>
                        <li>2. ReduxThunk GET data dari MockAPI → state.items</li>
                        <li>3. useSelector membaca items → component render</li>
                        <li>4. Add/Edit/Remove → dispatch thunk → API call → state update</li>
                    </ul>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default WatchHistoryPage;