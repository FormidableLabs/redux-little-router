'use strict';

const CompressionPlugin = require('compression-webpack-plugin');
const mergeWebpackConfig = require('webpack-partial').default;
const optimize = require('webpack').optimize;

module.exports = function () {
  return function (config) {
    return mergeWebpackConfig(config, {
      plugins: [
        new optimize.DedupePlugin(),
        new optimize.UglifyJsPlugin(),
        new CompressionPlugin({
          asset: '[path].gz[query]',
          test: /\.js$|\.css$/,
          algorithm: 'gzip',
          threshold: 1500
        })
      ]
    });
  };
};
