module.exports = {
  mode:"jit",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'md': '550px',
        'lg': '820px',
        // 'md': '400px',
      },
    },
  },
  plugins: [],
}