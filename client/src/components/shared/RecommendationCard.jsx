import Icon from "../ui/Icon";
import Badge from "../ui/Badge";

function RecommendationCard({film, onSelect}) {
    if (!film) return null;

    const handleClick = () => {
        if (onSelect) {
            onSelect(film);
        }
    };

    return (
        <article
            onClick={handleClick}
            className="recommendation-card shrink-0 w-35 sm:w-40 md:w-45
                        group cursor-pointer"
        >
            <div className="recommendation-card-image-wrapper relative aspect-2/3
                            rounded-lg overflow-hidden mb-2">
                <img 
                    src={film.image} 
                    alt={film.title} 
                    className="w-full h-full object-cover transition-transform 
                                duration-300 group-hover:scale-110"
                />

                {film.isPremium && (
                    <Badge variant="premium" className="top-2 left-2">
                        Premium
                    </Badge>
                )}

                {film.topRank && (
                    <Badge variant="top10" className="top-0 right-2">
                        TOP<br />{film.topRank}
                    </Badge>
                )}

                {film.rating && (
                    <Badge variant="rating" className="bottom-2 left-2">
                        <Icon name="star" className="h-3 w-3"/>
                        <span>{film.rating}</span>
                    </Badge>
                )}

                {/* overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100
                        transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex 
                            items-center justify-center border-2 border-white">
                        <Icon name="play" className="h-6 w-6 text-white ml-1"/>
                    </div>
                </div>
            </div>

            <h3 className="recommendation-card-title text-white text-xs sm:text-sm
                    font-medium truncate text-center">
                {film.title}
            </h3>
        </article>
    )
}

export default RecommendationCard