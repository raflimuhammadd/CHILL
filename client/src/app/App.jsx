import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import HomePage from '../pages/HomePage';
import ContinueWatchingPage from '../pages/ContinueWatchingPage';
import TopRatingPage from '../pages/TopRatingPage';
import TrendingPage from '../pages/TrendingPage';
import NewReleasePage from '../pages/NewReleasePage';
import WatchPage from '../features/video/pages/WatchPage';
import DetailPage from '../pages/DetailPage';
import SeriesPage from '../pages/SeriesPage';
import FilmPage from '../pages/FilmPage';
import MyListPage from '../features/my-list/pages/MyListPage';
import ProfilePage from '../features/profile/pages/ProfilePage';
import PaymentPage from '../features/subscription/pages/PaymentPage';
import PremiumPage from '../features/subscription/pages/PremiumPage';
import WatchHistoryPage from '../pages/WatchHistoryPage';
import SearchPage from '../pages/SearchPage';
import VerifyEmailPage from '../features/auth/pages/VerifyEmailPage';
import NotificationsPage from '../pages/NotificationsPage';
import ScrollToTop from '../components/ScrollToTop';
import ProtectedRoute from '../components/shared/ProtectedRoute';
import useAuthStore from '../features/auth/store/authStore';
import { Toaster } from 'react-hot-toast';

function App() {
    const user = useAuthStore((state) => state.user);
    const isLoading = useAuthStore((state) => state.isLoading);
    const fetchMe = useAuthStore((state) => state.fetchMe);

    useEffect(() => {
        fetchMe();
    }, [fetchMe]);

    if (isLoading && user === undefined) {
        return (
            <div className="min-h-screen bg-chill-dark flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white" />
            </div>
        );
    }

    return (
        <BrowserRouter>
            <Toaster position="bottom-right" gutter={8} containerClassName="mb-4" />
            <ScrollToTop />
            <Routes>
                <Route path="/verify-email" element={<VerifyEmailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/continue-watching" element={<ProtectedRoute><ContinueWatchingPage /></ProtectedRoute>} />
                <Route path="/top-rating" element={<ProtectedRoute><TopRatingPage /></ProtectedRoute>} />
                <Route path="/trending" element={<ProtectedRoute><TrendingPage /></ProtectedRoute>} />
                <Route path="/new-release" element={<ProtectedRoute><NewReleasePage /></ProtectedRoute>} />
                <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
                <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
                <Route path="/series" element={<ProtectedRoute><SeriesPage /></ProtectedRoute>} />
                <Route path="/film" element={<ProtectedRoute><FilmPage /></ProtectedRoute>} />
                <Route path="/my-list" element={<ProtectedRoute><MyListPage /></ProtectedRoute>} />
                <Route path="/watch/:id" element={<ProtectedRoute><WatchPage /></ProtectedRoute>} />
                <Route path="/watch-history" element={<ProtectedRoute><WatchHistoryPage /></ProtectedRoute>} />
                <Route path="/premium" element={<ProtectedRoute><PremiumPage /></ProtectedRoute>} />
                <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
                <Route path="/detail/:id" element={<ProtectedRoute><DetailPage /></ProtectedRoute>} />

                <Route path="/" element={<Navigate to="/home" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;