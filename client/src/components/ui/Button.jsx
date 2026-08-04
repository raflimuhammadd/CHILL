function Button({ variant = 'primary', size = 'md', className = '', children, ...props}) {
    const variants = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white font-semibold',
        auth: 'bg-[#3D4142]/50 hover:bg-[#3D4142]/90 text-white font-semibold cursor-pointer',
        secondary: 'border border-white/50 hover:bg-white/20 text-white font-semibold',
        ghost: 'text-white/60 hover:text-white',
        icon: 'bg-white/20 hover:bg-white/30 text-white',
    };

    const sizes = {
        xs: 'px-3 py-1.5 text-xs',
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-3 text-lg',
    };

    const base = 'rounded-full transition flex items-center justify-center gap-2';
    const iconBase = 'flex items-center justify-center rounded-full transition box-border';
    const iconSizes = {
        xs: 'w-7 h-7',
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12',
        icon: 'w-10 h-10',
    };

    const isIcon = size === 'icon';
    const classes = isIcon
        ? `${iconBase} ${iconSizes[size] || iconSizes.md} ${variants.icon} ${className}`
        : `${base} ${sizes[size] || sizes.md} ${variants[variant]} ${className}`;

    return (
        <button className={classes} {...props}>
            {children}
        </button>
    )
}

export default Button;