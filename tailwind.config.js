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
      colors:{
        bluediscord: "#5865F2",
        bluetelegram: "#34A9E5"
      },
    },
    keyframes: {
      // Toast
      "toast-hide": {
        "0%": { opacity: 1 },
        "100%": { opacity: 0 },
      },
      "toast-slide-in-right": {
        "0%": { transform: `translateX(calc(100% + 1rem))` },
        "100%": { transform: "translateX(0)" },
      },
      "toast-slide-in-bottom": {
        "0%": { transform: `translateY(calc(100% + 1rem))` },
        "100%": { transform: "translateY(0)" },
      },
      "toast-swipe-out-x": {
        "0%": { transform: "translateX(var(--radix-toast-swipe-end-x))" },
        "100%": {
          transform: `translateX(calc(100% + 1rem))`,
        },
      },
      "toast-swipe-out-y": {
        "0%": { transform: "translateY(var(--radix-toast-swipe-end-y))" },
        "100%": {
          transform: `translateY(calc(100% + 1rem))`,
        },
      },
      // Tooltip
      "slide-up-fade": {
        "0%": { opacity: 0, transform: "translateY(2px)" },
        "100%": { opacity: 1, transform: "translateY(0)" },
      },
      "slide-right-fade": {
        "0%": { opacity: 0, transform: "translateX(-2px)" },
        "100%": { opacity: 1, transform: "translateX(0)" },
      },
      "slide-down-fade": {
        "0%": { opacity: 0, transform: "translateY(-2px)" },
        "100%": { opacity: 1, transform: "translateY(0)" },
      },
      "slide-left-fade": {
        "0%": { opacity: 0, transform: "translateX(2px)" },
        "100%": { opacity: 1, transform: "translateX(0)" },
      },
    },
    animation: {
       // Toast
      "toast-hide": "toast-hide 100ms ease-in forwards",
      "toast-slide-in-right":
        "toast-slide-in-right 150ms cubic-bezier(0.16, 1, 0.3, 1)",
      "toast-slide-in-bottom":
        "toast-slide-in-bottom 150ms cubic-bezier(0.16, 1, 0.3, 1)",
      "toast-swipe-out-x": "toast-swipe-out-x 100ms ease-out forwards",
      "toast-swipe-out-y": "toast-swipe-out-y 100ms ease-out forwards",
      // Tooltip
      "slide-up-fade": "slide-up-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      "slide-right-fade":
        "slide-right-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      "slide-down-fade": "slide-down-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      "slide-left-fade": "slide-left-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/typography'),
    require("tailwindcss-radix")({
      variantPrefix: "rdx",
    }),
    require('tailwind-scrollbar')({ nocompatible: true }),
    require('tailwindcss/plugin')(function ({addBase}) {
      addBase({
        '[type="search"]::-webkit-search-decoration': {display: 'none'},
        '[type="search"]::-webkit-search-cancel-button': {display: 'none'},
        '[type="search"]::-webkit-search-results-button': {display: 'none'},
        '[type="search"]::-webkit-search-results-decoration': {display: 'none'},
      })
    }),
  ],
}
