function Badge({variant = 'rating', children, className = '', ...props}) {
    const variants = {
        rating: 'bg-black/70 text-[#FFD700] backdrop-blur flex items-center gap-0.5',
        age: 'bg-red-600 text-white',
        episode: 'bg-blue-600 text-white',
        premium: 'bg-[#FFC107] text-black font-bold uppercase text-[0.625rem] tracking-wide',
        top10: 'bg-red-600 text-white w-[31px] h-12 flex flex-col items-center justify-center text-[0.65rem] leading-[1.4] tracking-[0.2px] rounded-tl-none rounded-tr rounded-br-none rounded-bl text-center',
    };

    return (
        <span
            className={`absolute px-2 py-1 rounded text-xs font-bold ${
                variants[variant] || variants.rating
            } ${className}`}
            {...props}
        >
            {children}
        </span>
    )
}

export default Badge;