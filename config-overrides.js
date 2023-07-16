/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-var-requires,import/no-extraneous-dependencies */
// const StylelintPlugin = require('stylelint-webpack-plugin');
const {
  useBabelRc,
  addWebpackModuleRule,
  disableEsLint,
  addWebpackPlugin,
} = require('customize-cra');
const webpack = require('webpack');

module.exports = function override(config, env) {
  config = useBabelRc()(config);
  // Definition for rule '@typescript-eslint/no-object-literal-type-assertion' was not found
  // Probably not using correct list of plugins for react rewired (lint command works directly)
  // config = useEslintRc(path.resolve(__dirname, '.eslintrc'))(config);
  config = disableEsLint()(config);

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
  config = addWebpackPlugin(
    new webpack.ProvidePlugin({
      React: 'react',
    }),
  )(config);

  return config;
};
