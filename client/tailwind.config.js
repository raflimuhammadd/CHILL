/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    screens: {
      'xs': '375px',   // small phones (iPhone SE, etc)
      'sm': '640px',   // tablets
      'md': '768px',   // desktop
      'lg': '1024px',  // large desktop
      'xl': '1280px',  // extra large
      '2xl': '1536px', // 2K screens
    },
    extend: {
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(100%)', opacity: '0' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }
      })
    }
  ]
}