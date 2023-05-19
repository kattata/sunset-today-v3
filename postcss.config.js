/* eslint-disable no-undef */
module.exports = () => {
  return {
    plugins: [
      require('postcss-nested')(),
      require('autoprefixer')()
    ],
  };
};