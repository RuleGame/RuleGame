/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-param-reassign */
// const StylelintPlugin = require('stylelint-webpack-plugin');
// eslint-disable-next-line @typescript-eslint/no-var-requires,import/no-extraneous-dependencies
const { useBabelRc, addWebpackModuleRule, babelInclude, babelExclude } = require('customize-cra');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

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
  config = addWebpackModuleRule({ test: /\.(graphql|gql)$/, use: 'graphql-tag/loader' })(config);
  config = babelInclude([
    path.resolve('node_modules/shared/'),
    path.resolve('../shared/'),
    path.resolve('src'), // make sure you link your own source
  ])(config);
  config = babelExclude([/node_modules\/(?![shared])/])(config);
  return config;
};
