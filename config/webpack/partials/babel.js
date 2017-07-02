'use strict';

const loader = require('webpack-partial/loader').default;

module.exports = opts => loader({
  test: /\.jsx?$/,
  exclude: /node_modules/,
  include: process.cwd(),
  loader: require.resolve('babel-loader'),
  query: opts
});
