/* eslint-disable no-undef */
export default () => {
  return {
    plugins: [
      require('postcss-nested')(),
      require('autoprefixer')()
    ],
  };
};