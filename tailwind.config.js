/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-montserrat)']
      },
      gridTemplateColumns: {
        'fill': 'repeat(auto-fill, 296px)'
      },
      spacing: {
        '74': '18.5rem' 
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require("tailwindcss-radix")({
      variantPrefix: "rdx",
    })
  ],
}
