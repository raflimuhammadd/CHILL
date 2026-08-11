import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import NotificationsPage from '../pages/NotificationsPage';
import ScrollToTop from '../components/ScrollToTop';
import {Toaster} from 'react-hot-toast';

function App() {
  return (
    <BrowserRouter>
    <Toaster position="bottom-right" gutter={8} containerClassName="mb-4"/>
    <ScrollToTop/>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage/>} />
        <Route path="/continue-watching" element={<ContinueWatchingPage />} />
        <Route path="/top-rating" element={<TopRatingPage />} />
        <Route path="/trending" element={<TrendingPage />} />
        <Route path="/new-release" element={<NewReleasePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />

        {/* Series - Movie */}
        <Route path="/series" element={<SeriesPage />} />
        <Route path="/film" element={<FilmPage />} />
        <Route path="/my-list" element={<MyListPage />} />
        <Route path="/watch/:id" element={<WatchPage />} />
        <Route path="/watch-history" element={<WatchHistoryPage />} />

        {/* premium */}
        <Route path="/premium" element={<PremiumPage />} />
        <Route path="/payment" element={<PaymentPage />} />

        <Route path="/detail/:id" element={<DetailPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;