import {useNavigate} from 'react-router-dom';
import {Button, Icon} from '../ui';
import {useState, useEffect} from 'react';


function Hero({featuredFilm}) {
    const navigate = useNavigate();
    const [isMuted, setIsMuted] = useState(true);
    const [showVideo, setShowVideo] = useState(false);
    const [videoError, setVideoError] = useState(false);

    useEffect(() => {
        if (!featuredFilm?.youtubeId) return;
        const timer = setTimeout(() => setShowVideo(true), 2500);
        return () => clearTimeout(timer);
    }, [featuredFilm.youtubeId]);
    
    const handleMuteClick = () => {
        setIsMuted(prev => !prev);
        console.log('muted', isMuted);
    }

    const handleVideoError = () => {
        setVideoError(true);
        console.log('video error');
    };

    const handlePlayClick = () => {
        if (featuredFilm?.isBlocked) {
            navigate('/premium');
            return;
        }
        navigate(`/watch/${featuredFilm.id}`);
    };
    
    return (
        <section className="
            relative min-h-[50vh] xs:min-h-[55vh] 
            sm:min-h-[65vh] md:min-h-[75vh] 
            lg:min-h-[85vh] overflow-hidden">
            
            <img 
                src={featuredFilm.hoverImage}
                alt={featuredFilm.title}
                className="absolute inset-0 w-full h-full object-cover"
            />

            {showVideo && featuredFilm.youtubeId && !videoError && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none animate-fade-in">
                    <iframe 
                        src={`https://www.youtube-nocookie.com/embed/${featuredFilm.youtubeId}?autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=${featuredFilm.youtubeId}&controls=0&showinfo=0&rel=0&playsinline=1`}
                        onError={handleVideoError}
                        className="absolute"
                        style={{
                            width: '177.78vh',
                            height: '56.25vw',
                            minWidth: '100%',
                            minHeight: '100%',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                        }}
                        allow="autoplay; encrypted-media"
                        title={featuredFilm.title}
                    />
                </div>
            )}


            {/* overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-chill-dark via-black/75 to-black/20">
                <div className="relative z-10 h-full flex items-end py-12 container-responsive">
                    <div className="w-full flex flex-col">
                        <div className="max-w-4xl mb-0">
                            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-3 xs:mb-4 leading-tight">
                                {featuredFilm.title}
                            </h1>

                            <p className="
                                text-white/80 text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl mb-3 xs:mb-4 sm:mb-5 
                                max-w-[65ch] line-clamp-3 xs:line-clamp-4 sm:line-clamp-none
                            ">
                                {featuredFilm.description}
                            </p>
                        </div>

                        {/* actions-btn*/}
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2 xs:gap-3 sm:gap-4 flex-wrap">
                                <button
                                    onClick={handlePlayClick}
                                    className="bg-[#0F1E93] hover:bg-[#09147A] text-white font-semibold
                                    px-2.5 sm:px-8 py-2 sm:py-3 rounded-full transition shrink-0 text-xs sm:text-base"
                                >
                                    Mulai
                                </button>

                                <button
                                    onClick={() => navigate(`/detail/${featuredFilm.id}`)}
                                    className="bg-white/20 hover:bg-white/30 text-white font-semibold
                                    px-2.5 sm:px-8 py-2 sm:py-3 rounded-full transition flex items-center gap-1 sm:gap-2 shrink-0 text-xs sm:text-base"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="sm:w-5 sm:h-5">
                                        <circle cx="12" cy="12" r="10"/>
                                        <path d="M12 16v-4M12 8h.01"/>
                                    </svg>
                                    Selengkapnya
                                </button>
                                
                                <span className=" text-white border border-chill-gray-700 w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-chill-gray
                                                    flex items-center justify-center text-xs sm:text-sm font-bold shrink-0">
                                    {featuredFilm.age}
                                </span>
                            </div>

                            <Button 
                                variant="secondary" 
                                size="icon"
                                onClick={handleMuteClick}
                                aria-label={isMuted ? 'Unmute' : 'Mute'}
                            >
                                <Icon name={isMuted ? 'speaker-x' : 'volume'} className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>


                </div>
            </div>
        </section>
    )
}

export default Hero;