'use strict';

const _ = require('lodash');
const cssnext = require('postcss-cssnext');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const mergeWebpackConfig = require('webpack-partial').default;
const combineLoaders = require('webpack-combine-loaders');
const postcssImport = require('postcss-import');
const postcssReporter = require('postcss-reporter');

module.exports = function (opts) {
  opts = _.defaults(opts, {
    production: false,
    cssOpts: {}
  });

  const cssLoader = combineLoaders([
    {
      loader: require.resolve('css-loader'),
      query: _.assign({
        autoprefixer: false,
        mergeRules: false, // disable or keyframes break
        modules: true,
        sourceMap: true,
        importLoaders: 1,
        localIdentName: '[local]___[hash:base64:5]',
        context: 'src'
      }, opts.cssOpts)
    },
    {
      loader: require.resolve('postcss-loader')
    }
  ]);

  return function (config) {
    return mergeWebpackConfig(config, {
      module: {
        loaders: [
          {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract(
              require.resolve('style-loader'),
              cssLoader
            )
          }
        ]
      },
      plugins: [
        // Hashes in CSS file names make the dev server choke.
        // Only enable hashes in production!
        new ExtractTextPlugin(
          `[name]${opts.production ? '.[hash]' : ''}.css`,
          opts.extractTextPlugin
        )
      ],
      postcss() {
        return [
          postcssImport,
          cssnext(),
          postcssReporter({
            throwError: true
          })
        ];
      }
    });
  };
};
