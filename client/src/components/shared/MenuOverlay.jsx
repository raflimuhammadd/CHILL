import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../ui/Icon';

function MenuOverlay({isOpen, onClose, onLogout}) {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.addEventListener('keydown', handleEscape);
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    return (
        <div className={`fixed inset-0 z-60 ${isOpen ? '' : 'pointer-events-none'}`}>
            <div
                className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
                    isOpen ? 'opacity-100' : 'opacity-0'
                }`}
                onClick={onClose}
            />

            <div
                className={`absolute inset-0 flex flex-col items-center justify-center bg-chill-dark/95 
                    transition-transform duration-300 ease-out ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <nav className="flex flex-col items-center gap-6 text-white">
                    <Link
                        to="/home"
                        onClick={onClose}
                        className="text-2xl font-medium text-white/80 hover:text-red-500 transition-colors"
                    >
                        Home
                    </Link>
                    <Link
                        to="/series"
                        onClick={onClose}
                        className="text-2xl font-medium text-white/80 hover:text-red-500 transition-colors"
                    >
                        Series
                    </Link>
                    <Link
                        to="/film"
                        onClick={onClose}
                        className="text-2xl font-medium text-white/80 hover:text-red-500 transition-colors"
                    >
                        Film
                    </Link>
                    <Link
                        to="/my-list"
                        onClick={onClose}
                        className="text-2xl font-medium text-white/80 hover:text-red-500 transition-colors"
                    >
                        My List
                    </Link>
                    <Link
                        to="/watch-history"
                        onClick={onClose}
                        className="text-2xl font-medium text-white/80 hover:text-red-500 transition-colors"
                    >
                        History
                    </Link>
                    <div className="flex items-center gap-6 mb-4">
                        <Link
                            to="/search"
                            onClick={onClose}
                            className="relative flex flex-col items-center gap-2 text-white/80 hover:text-red-500 transition-colors"
                        >
                            <Icon name="search" className="w-5 h-5" />
                            <span className="text-sm">Search</span>
                        </Link>
                        
                        <Link
                            to="/notifications"
                            onClick={onClose}
                            className="relative flex flex-col items-center gap-2 text-white/80 hover:text-red-500 transition-colors"
                        >
                            <Icon name="bell" className="w-5 h-5" />
                            {/* Badge */}
                            <span className="absolute top-0 right-3 w-4 h-4 bg-red-500 
                                        rounded-full text-[10px] flex items-center justify-center">
                                3
                            </span>
                            <span className="text-sm">Notifications</span>
                        </Link>
                    </div>
                    <div className="w-48 border-t border-white/20 my-2" />
                    <Link
                        to="/profile"
                        onClick={onClose}
                        className="text-2xl font-medium text-white/80 hover:text-red-500 transition-colors"
                    >
                        Account
                    </Link>
                    <button
                        onClick={onLogout}
                        className="text-2xl font-medium text-white/80 active:text-red-500 transition-colors"
                    >
                        Sign Out
                    </button>
                    <button
                        onClick={onClose}
                        className="mt-4 w-12 h-12 rounded-full border-2 border-white/40 flex items-center justify-center text-white/60 hover:border-white hover:text-white transition-colors"
                        aria-label="Close menu"
                    >
                        <Icon name="x" className="w-6 h-6"/>
                    </button>
                </nav>
            </div>
        </div>
    );
}

export default MenuOverlay;
