import { Icon } from "../ui";
import {useFavorites} from "../../hooks/useFavorites";
import {useNavigate} from "react-router-dom";
import useModalStore from "../../store/modalStore";

function HoverOverlayLandscape({film}) {
  const {isFavorite, addToFavorites, removeFromFavorites} = useFavorites();
  const {openModal} = useModalStore();
  const favorited = isFavorite(film.id);
  const navigate = useNavigate();

  const handlePlay = (e) => {
    e.stopPropagation();
    if (film.isBlocked) {
        navigate('/premium');
        return;
    }
    navigate(`/watch/${film.id}`);
  };

  const toggleFavorite = (e) => {
    e.stopPropagation(); //prevent card click evnt
    if (favorited) {
        removeFromFavorites(film.id);
    } else {
        addToFavorites(film.id);
    }
  };

  return (
    <div className="hover-overlay-landscape absolute inset-0 opacity-0 invisible group-hover:opacity-100 
      group-hover:visible transition-all duration-300 z-10 flex items-center 
      justify-center rounded-lg overflow-hidden">
      
      {/* dark overlay */}
      <div className="hover-overlay-landscape-background absolute inset-0 bg-black/70" />
      
      {/* action buttons */}
      <div className="hover-overlay-landscape-actions relative flex items-center gap-4 z-2">
        <button
          onClick={toggleFavorite}
          className="hover-overlay-landscape-button hover-overlay-landscape-button--favorite 
            w-10 h-10 rounded-full border-2 border-white/50 
            hover:border-white hover:bg-white/15 hover:scale-110 
            transition-all duration-300 flex items-center justify-center text-white"
          aria-label="Add to favorites"
        >
          <Icon 
            name={favorited ? "check" : "plus"}
            className="h-5 w-5" 
          />
        </button>

        <button
          onClick={handlePlay}
          className="hover-overlay-landscape-button hover-overlay-landscape-button--play 
            w-12 h-12 rounded-full border-2 border-white/50 
            hover:border-white hover:bg-white/15 hover:scale-110 
            transition-all duration-300 flex items-center justify-center text-white"
          aria-label="Play"
        >
          <Icon
              name={film.isBlocked ? 'lock' : 'play'}
              className="h-6 w-6 fill-white"
          />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            openModal(film);
          }}
          className="hover-overlay-landscape-button hover-overlay-landscape-button--detail 
            w-10 h-10 rounded-full border-2 border-white/50 
            hover:border-white hover:bg-white/15 hover:scale-110 
            transition-all duration-300 flex items-center justify-center text-white"
          aria-label="More details"
        >
          <Icon name="arrowDown" className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

export default HoverOverlayLandscape;