import {forwardRef} from 'react';
import Icon from '../ui/Icon';

const ScrollButtons = forwardRef(function ScrollButtons({scrollRef, direction, className =''}) {
    const scrollAmount = 320;
    const handleClick = () =>  scrollRef.current?.scrollBy({left: direction === 'left'
        ? -scrollAmount : scrollAmount, behavior: 'smooth'
    });

    return (
        <button
            onClick={handleClick}
            className={`scroll-button scroll-button--${direction} absolute top-1/2 -translate-y-1/2 z-20 w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 rounded-full
                    bg-black/50 hover:bg-black/70 hover:scale-110 
                    flex items-center justify-center text-white 
                    transition-all duration-300 ease-in-out
                    ${className}`}
                    aria-label={direction === 'left' ? 'Scroll left' : 'Scroll right'}
        >
            <Icon name={direction === 'left' ? 'arrowLeft' : 'arrowRight'}
                className="scroll-button-icon h-4 w-4"
            />
        </button>
    )
})

export default ScrollButtons;