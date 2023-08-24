export const toRem = (px) => `${px / 16}rem`

export const toRemArr = (arr) => {
  return arr.reduce((acc, curr) => ({ ...acc, [curr]: toRem(curr), [curr * -1]: toRem(curr * -1) }), {});
};
const spacingValues = Array
  .from({ length: 750 }, (_, i) => i)
  .filter((val) => val <= 100 || val % 5 === 0)

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      spacing: {
        ...toRemArr(spacingValues),
      },
      minWidth: toRemArr(spacingValues),
      maxWidth: toRemArr(spacingValues),
      backgroundImage: {
        'desktop-art': "url('/images/other/desktop-art.jpg')"
      }
    },
  },
  plugins: [],
}

