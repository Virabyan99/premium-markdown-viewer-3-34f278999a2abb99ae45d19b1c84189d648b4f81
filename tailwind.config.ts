/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
      "./lib/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          kr: ['"Noto Sans KR"', 'sans-serif'],
          jp: ['"Noto Sans JP"', 'sans-serif'],
          sc: ['"Noto Sans SC"', 'sans-serif'],
        },
      },
    },
    plugins: [],
  };