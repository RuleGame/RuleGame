/* eslint-disable no-param-reassign */
// const StylelintPlugin = require('stylelint-webpack-plugin');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { addBabelPlugin } = require('customize-cra');

module.exports = function override(config, env) {
  config = addBabelPlugin('babel-plugin-styled-components')(config);

  if (env === 'development') {
    config.plugins
      .push
      // Freezes npm start
      // new StylelintPlugin({
      //   // options here
      // }),
      ();
  }
  return config;
};
