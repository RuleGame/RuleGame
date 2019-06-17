// const StylelintPlugin = require('stylelint-webpack-plugin');

module.exports = function override(config, env) {
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
