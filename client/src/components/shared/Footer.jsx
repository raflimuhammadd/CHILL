import { useState, useEffect } from "react";
import Icon from "../ui/Icon";
import logoChill from "/assets/images/logo-chill.png";

const genres = [
    { title: 'Genre', columns: [
        ['Aksi', 'Anak-anak', 'Anime', 'Britania'],
        ['Drama', 'Fantasi Ilmiah & Fantasi', 'Kejahatan', 'Britania'],
        ['Komedi', 'KDrama', 'Perang'],
        ['Sains & Alam', 'Thriller'],
    ]}
];

const bantuanLinks = ['FAQ', 'Kontak Kami', 'Kebijakan Privasi', 'Syarat & Ketentuan'];

function AccordionSection({title, children}) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        function handleResize() {
            if (window.innerWidth >= 768) setIsOpen(false);
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const id = title.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className="footer-accordion">
            {/* Mobile heading (clickable) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="footer-accordion-toggle flex md:hidden items-center justify-between w-full
                text-white font-bold py-3"
                aria-expanded={isOpen}
                aria-controls={`nav-${id}`}
            >
                {title}
                <Icon name={isOpen ? 'chevron-up' : 'chevron-down'}
                    className="h-4 w-4 transition-transform"
                />
            </button>

            {/* Desktop heading (with border) */}
            <h3 className="footer-accordion-heading hidden md:block text-white font-bold mb-3 pb-3 border-b border-white/10">
                {title}
            </h3>

            {/* Navigation links */}
            <nav
                id={`nav-${id}`}
                className={`footer-accordion-content ${isOpen ? 'block' : 'hidden'} md:flex! flex-col pb-3 md:pb-0`}
            >
                {children}
            </nav>
        </div>
    )
}

function Footer() {
    return (
        <footer className="footer bg-[#1A1A1A] border-t border-white/10 py-12 mt-auto">
            <div className="footer-container container-responsive">
                <div className="footer-grid flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-16">
                    
                    {/* Brand section */}
                    <div className="footer-brand flex flex-col gap-3 md:min-w-45 lg:flex-1">
                        <img src={logoChill} alt="CHILL" className="w-30 h-auto" />
                        <p className="footer-copyright text-sm text-gray-400 font-medium max-w-75">
                            ©2026 CHILL. All rights reserved
                        </p>
                        <p className="footer-description text-xs text-gray-500 leading-relaxed max-w-75">
                            Platform Streaming Film dan Series Terbaik di Indonesia
                        </p>
                    </div>

                    {/* Genre section */}
                    <div className="footer-genre flex-1 md:flex-[2.5] lg:flex-2">
                        <AccordionSection title="Genre">
                            <div className="footer-genre-grid grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                                {genres[0].columns.map((col, i) => (
                                    <div key={i} className="footer-genre-column flex flex-col gap-1 md:gap-2">
                                        {col.map((link) => (
                                            <a key={link} href="#" className="text-sm text-gray-400
                                            hover:text-red-500 transition py-0.5 md:py-1">
                                                {link}
                                            </a>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </AccordionSection>
                    </div>

                    {/* Bantuan section */}
                    <div className="footer-help md:min-w-45 lg:flex-1">
                        <AccordionSection title="Bantuan">
                            <div className="footer-help-list flex flex-col gap-1 md:gap-2">
                                {bantuanLinks.map((link) => (
                                    <a key={link} href="#" className="text-sm text-gray-400
                                    hover:text-red-500 transition py-0.5 md:py-1">
                                        {link}
                                    </a>
                                ))}
                            </div>
                        </AccordionSection>
                    </div>

                </div>
            </div>
        </footer>
    )
}

export default Footer;