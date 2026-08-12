import { useState, useEffect, useRef } from "react";
import {useNavigate} from 'react-router-dom';
import useAuthStore from "../../auth/store/authStore";
import { Icon } from "../../../components/ui";

function ProfileDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const dropdownRef = useRef(null);
    const {user, logout} = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        const checkScreenSize = () => {
            setIsDesktop(window.innerWidth >= 640);
        };
        
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);

    const handleLogout = () => {
        setIsOpen(false);
        logout();
        navigate('/login');
    };

    return (
        <div ref={dropdownRef} className={`profile-dropdown relative ${isOpen ? 'open' : ''}`}>
            <button
                onClick={!isDesktop ? () => setIsOpen(!isOpen) : undefined}
                className="profile-dropdown-toggle h-8 xs:h-9 sm:h-10 md:h-12 rounded-full transition
                flex items-center justify-center gap-2 cursor-pointer"
                aria-label="Profile menu"
            >
                <img src={user?.avatar_url || '/assets/images/profile.png'} 
                    alt="Profile"
                    className="profile-dropdown-avatar h-8 w-8 xs:h-9 xs:w-9 
                    sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full object-cover" 
                />
                <Icon 
                    name="chevronDown" 
                    className={`text-white stroke-amber-500 h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`} 
                />
            </button>

            <div className="profile-dropdown-menu absolute right-0 top-full pt-2 w-44 z-50">
                <div className="bg-[#181a1c] border border-white/20 rounded-lg shadow-lg overflow-hidden">
                    <div className="px-4 py-3 border-b border-white/20 animate-fadeIn">
                        <p className="text-white/60 text-sm">
                            Hello, {user?.username?.charAt(0).toUpperCase() + user?.username?.slice(1) || 'User'}
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            navigate('/profile');
                        }}
                        className="profile-dropdown-item w-full px-4 py-3 text-left text-white hover:text-red-500 transition flex items-center gap-3 border-b border-white/10 hover:bg-white/5"
                    >
                         <Icon name="user" className="h-5 w-5"/>
                        Profil Saya
                    </button>

                    <button onClick={() => { setIsOpen(false); navigate('/premium'); }}
                        className="profile-dropdown-item w-full px-4 py-3 text-left text-white hover:text-red-500 transition flex items-center gap-3 border-b border-white/10 hover:bg-white/5">
                        <Icon name="crown" className="h-5 w-5"/>
                        <span>Ubah Premium</span>
                    </button>

                    <button onClick={handleLogout}
                        className="profile-dropdown-item w-full px-4 py-3 text-left text-white hover:text-red-500 transition flex items-center gap-3 hover:bg-white/5">
                        <Icon name="logout" className="h-5 w-5"/>
                        <span>Keluar</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProfileDropdown;
