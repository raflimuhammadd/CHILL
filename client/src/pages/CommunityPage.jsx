import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navbar, Footer } from '../components';
import { fetchUsers } from '../store/redux/slices/usersSlice';

function CommunityPage() {
    const dispatch = useDispatch();
    const { users, loading, error } = useSelector((state) => state.users);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    return (
        <div className="min-h-screen bg-chill-dark text-white">
            <Navbar />

            <main className="container-responsive pt-28 md:pt-32 pb-16">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-3xl md:text-5xl font-bold mb-3">
                        Komunitas
                    </h1>
                    <p className="text-white/60 text-base md:text-lg">
                        Data ini diambil dari API menggunakan{' '}
                        <span
                            className="text-[#0586FF] font-medium">
                                <a href='https://redux-toolkit.js.org/introduction/getting-started'>
                                    Redux Toolkit
                                </a>
                        </span>
                        
                    </p>
                </div>

                {/* loading */}
                {loading && (
                    <div className="flex items-center gap-3 bg-white/5 rounded-xl p-6">
                        <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full" />
                        <span className="text-white/70">Memuat data dari API...</span>
                    </div>
                )}

                {/* error */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                        <p className="text-red-400 font-medium">Gagal memuat data</p>
                        <p className="text-red-400/70 text-sm mt-1">{error}</p>
                    </div>
                )}

                {/* user-grid */}
                {!loading && !error && users.length > 0 && (
                    <>
                        <div className="mb-4 text-white/50 text-sm">
                            Total: {users.length} anggota
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {users.map((user) => (
                                <div
                                    key={user.id}
                                    className="bg-white/5 rounded-xl p-5 flex flex-col items-center
                                               text-center hover:bg-white/10 transition-colors"
                                >
                                    <img
                                        src={user.avatar_url || '/assets/images/profile.png'}
                                        alt={user.username}
                                        className="w-20 h-20 rounded-full object-cover mb-3"
                                    />
                                    <p className="font-medium text-white text-sm">
                                        {user.username}
                                    </p>
                                    <p className="text-white/50 text-xs mt-1">
                                        {user.full_name || 'Member'}
                                    </p>
                                    {user.plan && user.plan !== 'Free' ? (
                                        <span className="mt-2 text-[10px] bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">
                                            {user.plan}
                                        </span>
                                    ) : (
                                        <span className="mt-2 text-[10px] bg-white/10 text-white/40 px-2 py-0.5 rounded-full">
                                            Free
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Info Box */}
                        <div className="mt-8 bg-[#09147A] border border-[#192DB7] rounded-xl p-5">
                            <p className="text-[#E7E3FCDE] font-medium text-sm mb-2">
                                Cara Kerja Redux di Halaman Ini:
                            </p>
                            <ul className="text-blue-300/70 text-sm space-y-1">
                                <li>1. Component mount → dispatch(fetchUsers())</li>
                                <li>2. ReduxThunk fetch data dari MockAPI</li>
                                <li>3. Data masuk ke Redux Store → state.users</li>
                                <li>4. useSelector membaca data → component re-render</li>
                            </ul>
                        </div>
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
}

export default CommunityPage;