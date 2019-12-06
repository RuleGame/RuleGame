/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-param-reassign */
// const StylelintPlugin = require('stylelint-webpack-plugin');
// eslint-disable-next-line @typescript-eslint/no-var-requires,import/no-extraneous-dependencies
const { useBabelRc, addWebpackModuleRule } = require('customize-cra');

module.exports = function override(config, env) {
  config = useBabelRc()(config);

  if (env === 'development') {
    config.plugins
      .push
      // Freezes npm start
      // new StylelintPlugin({
      //   // options here
      // }),
      ();
  }
  config = addWebpackModuleRule({ test: /\.txt$/, use: 'raw-loader' })(config);
  return config;
};
