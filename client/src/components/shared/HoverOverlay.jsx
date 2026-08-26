import {useNavigate} from 'react-router-dom';
import Icon from '../ui/Icon';
import {useFavorites} from '../../hooks/useFavorites';
import useModalStore from '../../store/modalStore';
import useEditModalStore from '../../store/editModalStore';
import {useState} from 'react';

function HoverOverlay({film, variant = 'default'}) {
    const navigate = useNavigate();
    const {openModal} = useModalStore();
    const {isFavorite, addToFavorites, removeFromFavorites} = useFavorites();
    const favorited = isFavorite(film.id);
    const {openEditModal} = useEditModalStore();
    const [isLoading, setIsLoading] = useState(false);

    const handlePlay = (e) => {
        e.stopPropagation();
        if (film.isBlocked) {
            openModal(film);
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

    const handleAddFavorite = async () => {
        setIsLoading(true);
        try {
            await toggleFavorite();
        } catch (err) {
            console.error('Failed to add favorite:', err);
        } finally {
            setIsLoading(false);
        }
    }

    if (variant === 'mylist') {
        return (
            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 
                            transition-opacity duration-300 gap-3 backdrop-blur-md bg-black/60">
                <div className="absolute inset-0" />
                <div className="relative flex flex-col items-center gap-4">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            openModal(film);
                        }}
                        className="bg-white text-black rounded-full w-10 h-10 
                        flex items-center justify-center hover:bg-gray-200 
                        transition transform hover:scale-110 shadow-lg"
                        aria-label="Play"
                    >
                        <Icon name="play" className="h-6 w-6 fill-black" />
                    </button>
                    <button
                        onClick={toggleFavorite}
                        className="bg-transparent border-2 border-gray-400 text-gray-200 rounded-full 
                        w-10 h-10 flex items-center justify-center hover:border-red-500 
                        hover:text-red-500 transition transform hover:scale-110"
                        aria-label="Remove from favorites"
                    >
                        <Icon name="delete" className="h-6 w-6" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(film);
                        }}
                        className="bg-transparent border-2 border-gray-400 text-gray-200 rounded-full 
                        w-10 h-10 flex items-center justify-center hover:border-blue-500 
                        hover:text-blue-500 transition transform hover:scale-110"
                        aria-label="Edit"
                    >
                        <Icon name="update" className="h-6 w-6" />
                    </button>
                </div>
            </div>
        );
    }


        return (
            <div className="hover-overlay absolute inset-0 opacity-0 group-hover:opacity-100
            transition-opacity duration-300 z-10">
                {/* back blur */}
                <div className="hover-overlay-background absolute inset-0 bg-black/80 backdrop-blur-sm" />

                {/* hover img thumbnail */}
                <div className="hover-overlay-thumbnail relative h-50 overflow-hidden rounded-t-lg">
                    <img 
                        src={film.hoverImage} 
                        alt={film.title}
                        className="hover-overlay-image w-full h-full object-cover"
                    />
                </div>

                {/* action buttons */}
                <div className="hover-overlay-actions relative flex items-center justify-center gap-4 p-4">
                    <button
                        onClick={handleAddFavorite}
                        disabled={isLoading}
                        className="hover-overlay-button hover-overlay-button--favorite
                            w-10 h-10 rounded-full bg-white/20 hover:bg-white/30
                            flex items-center justify-center text-white transition"
                        aria-label="Add to favorites"
                    >
                        <Icon 
                            name={favorited ? "check" : "plus"}
                            className="h-5 w-5" 
                        />
                    </button>
                    <button
                        onClick={handlePlay}                        
                        className="hover-overlay-button hover-overlay-button--play 
                        bg-white text-black rounded-full w-12 h-12 
                        flex items-center justify-center hover:bg-gray-200 
                        transition transform hover:scale-110 shadow-lg"
                        aria-label={film.isBlocked ? 'Upgrade to Premium' : 'Play'}
                    >
                        <Icon
                            name={film.isBlocked ? 'lock' : 'play'}
                            className="h-5 w-5 fill-black"
                        />
                    </button>
                    <button
                        onClick={(e) => {e.stopPropagation(); openModal(film);}}
                        className="hover-overlay-button hover-overlay-button--detail 
                            w-10 h-10 rounded-full bg-white/20 hover:bg-white/30
                            flex items-center justify-center text-white transition"
                        aria-label="Details"
                        >
                            <Icon name="arrowDown" className="h-5 w-5" />
                    </button>
                </div>

                {/* meta age+episodes */}
                <div className="hover-overlay-meta relative px-4 pb-3 flex gap-2 text-xs text-white/80">
                    {film.age && (
                    <span className="hover-overlay-age bg-red-500/80 px-2 py-0.5 rounded font-bold">{film.age}</span>
                    )}
                        <span className="hover-overlay-episodes">
                            {film.episodes}
                        </span>
                        <span className="hover-overlay-episodes">
                            {film.duration}
                        </span>
                </div>

                {/* genres */}
                {film.genres && (
                    <div className="hover-overlay-genres relative px-4 pb-2 flex flex-wrap gap-0.5">
                        {film.genres.map((g) => (
                            <span key={g} className="hover-overlay-genre-tag 
                            text-[11px] text-white/60 border border-white/20
                            px-2 py-0.5 rounded-full">
                                {g}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        )
    
}

export default HoverOverlay;