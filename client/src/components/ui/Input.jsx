import {forwardRef} from 'react';

const Input = forwardRef(function Input(
    {error, icon: IconComp, iconPosition = 'right', className = '', ...props},
    ref
) {
    const borderStyle = error
        ? 'border-red-500 focus:ring-red-500'
        : 'border-white/20 focus:ring-blue-500';
    
    return (
        <div className="relative">
            {IconComp && iconPosition === 'left' && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
                    {IconComp}
                </span>
            )}
            <input 
                ref={ref}
                className={`w-full px-4 py-3 bg-chill-gray border rounded-4xl text-white
                    placeholder:text-white/40 focus:outline-none focus:ring-2 transition
                    ${IconComp && iconPosition === 'right' ? 'pr-12' : ''}
                    ${borderStyle} ${className}`}
                {...props}
            />
            {IconComp && iconPosition === 'right' && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60">
                    {IconComp}
                </span>
            )}
        </div>
    )
})

export default Input;