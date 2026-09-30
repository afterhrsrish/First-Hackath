/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-green': '#00FF00',
        'hot-pink': '#FF007F',
        'blinding-yellow': '#FFFF00',
        'cyber-cyan': '#00FFFF',
        'radioactive-orange': '#FF6600',
        'ugly-purple': '#800080',
        'vomit-olive': '#808000',
        'hyper-blue': '#0000FF'
      },
      fontFamily: {
        comic: ['"Comic Neue"', '"Comic Sans MS"', 'cursive'],
        papyrus: ['Papyrus', 'fantasy'],
        impact: ['Impact', 'sans-serif'],
        times: ['"Times New Roman"', 'serif'],
        glitch: ['"Rubik Glitch"', 'cursive'],
        retro: ['"Press Start 2P"', 'monospace'],
        spooky: ['Creepster', 'cursive']
      },
      animation: {
        'fast-spin': 'spin 1.5s linear infinite',
        'reverse-spin': 'spin 2s linear infinite reverse',
        'violent-shake': 'shake 0.2s cubic-bezier(.36,.07,.19,.97) both infinite',
        'blinking': 'blink 0.6s infinite alternate',
        'rainbow-glow': 'rainbow 2s infinite linear',
        'marquee-fast': 'marquee 8s linear infinite',
        'marquee-reverse': 'marquee-rev 10s linear infinite',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) rotate(0deg)' },
          '20%': { transform: 'translate3d(-4px, 4px, 0) rotate(-3deg)' },
          '40%': { transform: 'translate3d(4px, -3px, 0) rotate(3deg)' },
          '60%': { transform: 'translate3d(-3px, 2px, 0) rotate(-2deg)' },
          '80%': { transform: 'translate3d(3px, -2px, 0) rotate(2deg)' },
        },
        blink: {
          '0%': { opacity: '1', filter: 'drop-shadow(0 0 10px #FF007F)' },
          '100%': { opacity: '0.15', filter: 'none' }
        },
        rainbow: {
          '0%': { color: '#FF007F', borderColor: '#00FF00' },
          '25%': { color: '#00FF00', borderColor: '#00FFFF' },
          '50%': { color: '#00FFFF', borderColor: '#FFFF00' },
          '75%': { color: '#FF6600', borderColor: '#FF007F' },
          '100%': { color: '#FF007F', borderColor: '#00FF00' }
        },
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' }
        },
        'marquee-rev': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        }
      }
    },
  },
  plugins: [],
}
