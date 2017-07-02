'use strict';

const { flow } = require('lodash');
const CompressionPlugin = require('compression-webpack-plugin');
const plugin = require('webpack-partial/plugin').default;
const optimize = require('webpack').optimize;

module.exports = () => flow(
  plugin(new optimize.UglifyJsPlugin()),
  plugin(new CompressionPlugin({
    asset: '[path].gz[query]',
    test: /\.js$|\.css$/,
    algorithm: 'gzip',
    threshold: 1500
  }))
);
