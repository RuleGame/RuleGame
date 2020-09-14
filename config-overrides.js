/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-param-reassign */
// const StylelintPlugin = require('stylelint-webpack-plugin');
// eslint-disable-next-line @typescript-eslint/no-var-requires,import/no-extraneous-dependencies
// eslint-disable-next-line @typescript-eslint/no-var-requires,import/no-extraneous-dependencies
const { useBabelRc, addWebpackModuleRule } = require('customize-cra');

module.exports = function override(config, env) {
  config = useBabelRc()(config);
  // Definition for rule '@typescript-eslint/no-object-literal-type-assertion' was not found
  // Probably not using correct list of plugins for react rewired (lint command works directly)
  // config = useEslintRc(path.resolve(__dirname, '.eslintrc'))(config);
  // const contents = fs.readFileSync(path.resolve(__dirname, '.eslintrc'), 'utf8');
  // console.log(contents);

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
  return config;
};
