module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
    ...(process.env.QUASAR_RTL ? [require('postcss-rtlcss')({})] : [])
  ]
}
