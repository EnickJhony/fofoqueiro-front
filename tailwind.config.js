/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx,mdx}', './components/**/*.{js,jsx,ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: '#08111f',
        panel: 'rgba(10, 15, 29, 0.72)',
        accent: '#74a3ff',
        accentDeep: '#4d7cff',
      },
      boxShadow: {
        glow: '0 24px 90px rgba(0, 0, 0, 0.35)',
      },
      backgroundImage: {
        atmosphere:
          'radial-gradient(circle at top, rgba(60, 120, 255, 0.28), transparent 34%), linear-gradient(160deg, #0b1020 0%, #12192f 55%, #0a0f1d 100%)',
      },
    },
  },
  plugins: [],
}
