import { useParams, useSearchParams, Navigate } from 'react-router-dom';
import { filmData } from '../../../data/filmData';
import useAuthStore from '../../auth/store/authStore';
import VideoPlayer from '../components/VideoPlayer';

function WatchPage() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const episodeParam = searchParams.get('episode');
  const currentEpisodeId = episodeParam ? parseInt(episodeParam) : 1;
  const { user } = useAuthStore();

  const filmKey = Object.keys(filmData).find(key => filmData[key].id === id);
  const film = filmKey ? filmData[filmKey] : null;

  if (!film) {
    return <Navigate to="/home" replace />;
  }

  const isSeries = film.episodesList && film.episodesList.length > 0;
  const currentEpisode = isSeries ? film.episodesList.find(ep => ep.id === currentEpisodeId) : null;

  if (isSeries && !currentEpisode) {
    return <Navigate to={`/watch/${id}?episode=1`} replace />;
  }

  const youtubeId = isSeries ? currentEpisode?.youtubeId : film.youtubeId;
  const title = isSeries ? `${film.title} - ${currentEpisode?.title}` : film.title;
  const isBlocked = film.isPremium && !user?.isPremium;

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
