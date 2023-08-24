/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      backgroundImage: {
        'desktop-art': "url('/images/other/desktop-art.jpg')"
      }
    },
  },
  plugins: [],
}

