module.exports = {
  mode: 'jit',
  content: ['src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        md: '550px',
        lg: '820px',
        // 'md': '400px',
      },
    },
  },
  plugins: [],
}
