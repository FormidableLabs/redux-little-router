'use strict';

const _ = require('lodash');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const loader = require('webpack-partial/loader').default;
const plugin = require('webpack-partial/plugin').default;

module.exports = function(opts) {
  opts = _.defaults(opts, {
    production: false,
    cssOpts: {}
  });

  return _.flow(
    loader({
      test: /\.(css)$/,
      use: ExtractTextPlugin.extract({
        fallback: require.resolve('style-loader'),
        use: [
          {
            loader: require.resolve('css-loader'),
            options: _.assign(
              {
                autoprefixer: false,
                mergeRules: false, // disable or keyframes break
                modules: true,
                sourceMap: true,
                importLoaders: 1,
                localIdentName: '[local]___[hash:base64:5]',
                context: 'src'
              },
              opts.cssOpts
            )
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              sourceMap: true,
              config: {
                path: path.resolve(__dirname, '../postcss.config.js')
              }
            }
          }
        ]
      })
    }),
    plugin(
      // Hashes in CSS file names make the dev server choke.
      // Only enable hashes in production!
      new ExtractTextPlugin(
        _.assign(
          {
            filename: `[name]${opts.production ? '.[hash]' : ''}.css`
          },
          opts.extractTextPlugin
        )
      )
    )
  );
};
