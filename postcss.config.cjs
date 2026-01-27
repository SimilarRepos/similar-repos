module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    './src/utils/styles/postcss-custom-props.cjs': {
      fromPrefix: '--tw-',
      toPrefix: '--lgk-tw-',
    },
    'autoprefixer': {},
    'postcss-rem-to-responsive-pixel': {
      rootValue: 16,
      propList: ['*'],
      transformUnit: 'px',
    },
  },
}
