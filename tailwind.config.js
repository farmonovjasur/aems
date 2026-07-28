/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'aemc-black': '#000000',
        'aemc-bg': '#050505',
        'aemc-card': '#0F0F0F',
        'aemc-dark-gray': '#222222',
        'aemc-medium-gray': '#333333',
        'aemc-border': '#333333',
        'aemc-gray': '#888888',
        'aemc-neon-blue': '#00A8FF',
        'aemc-neon-cyan': '#00FFFF',
        'aemc-accent-cyan': '#00F0FF',
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      clipPath: {
        chamfered: 'polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)',
      }
    },
  },
  plugins: [],
}
