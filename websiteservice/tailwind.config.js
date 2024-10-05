
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/flowbite/**/*.js",
    "./node_modules/sweetalert2/dist/sweetalert2.js"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1da1f2',
        secondary: '#14171a',
        accent: '#657786',
        success: '#00c851',
        warning: '#ffbb33',
        error: '#ff4444'
      },
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

