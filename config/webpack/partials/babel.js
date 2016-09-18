'use strict';

const mergeWebpackConfig = require('webpack-partial').default;

module.exports = function (opts) {
  return function (config) {
    return mergeWebpackConfig(config, {
      module: {
        loaders: [{
          name: 'babel',
          test: /\.jsx?$/,
          exclude: /node_modules/,
          include: process.cwd(),
          loader: require.resolve('babel-loader'),
          query: opts
        }]
      }
    });
  };
};
