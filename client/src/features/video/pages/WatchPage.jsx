import { useEffect, useState } from 'react';
import { useParams, useSearchParams, Navigate } from 'react-router-dom';
import useAuthStore from '../../auth/store/authStore';
import { contentService } from '../../../services/contentService';
import VideoPlayer from '../components/VideoPlayer';

function WatchPage() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const episodeParam = searchParams.get('episode');
  const currentEpisodeId = episodeParam ? parseInt(episodeParam, 10) : 1;
  const { user } = useAuthStore();

  const [film, setFilm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchContent = async () => {
      try {
        setLoading(true);
        // /watch/:id pakai slug (amazing-spidey); toleransi id numerik
        const isNumeric = /^\d+$/.test(id);
        const result = isNumeric
          ? await contentService.getContentById(id)
          : await contentService.getContentBySlug(id);
        if (!cancelled) setFilm(result?.data || null);
      } catch {
        if (!cancelled) setFilm(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchContent();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white" />
      </div>
    );
  }

  if (!film) {
    return <Navigate to="/home" replace />;
  }

  const isSeries = Array.isArray(film.episodesList) && film.episodesList.length > 0;
  const currentEpisode = isSeries
    ? film.episodesList.find((ep) => ep.id === currentEpisodeId)
    : null;

  if (isSeries && !currentEpisode) {
    return <Navigate to={`/watch/${id}?episode=1`} replace />;
  }

  const youtubeId = isSeries ? currentEpisode?.youtubeId : film.youtubeId;
  const title = isSeries ? `${film.title} - ${currentEpisode?.title}` : film.title;
  const isBlocked = Boolean(film.isPremium && !user?.isPremium);

  const handleEpisodeChange = (newEpisodeId) => {
    setSearchParams({ episode: newEpisodeId.toString() });
  };

  return (
    <VideoPlayer
      youtubeId={youtubeId}
      title={title}
      isBlocked={isBlocked}
      episodes={isSeries ? film.episodesList : null}
      currentEpisodeId={currentEpisodeId}
      onEpisodeChange={handleEpisodeChange}
    />
  );
}

export default WatchPage;