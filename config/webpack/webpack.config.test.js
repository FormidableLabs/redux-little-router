'use strict';
/**
 * Webpack frontend test configuration.
 */
var path = require('path');
var prodCfg = require('./webpack.config');

// Replace with `__dirname` if using in project root.
var ROOT = process.cwd();
var _ = require('lodash'); // devDependency

module.exports = {
  cache: true,
  context: path.join(ROOT, 'test'),
  entry: './main',
  output: {
    filename: 'main.js',
    publicPath: '/assets/'
  },
  resolve: _.merge({}, prodCfg.resolve, {
    alias: {
      // enzyme webpack issue https://github.com/airbnb/enzyme/issues/47
      sinon: 'node_modules/sinon/pkg/sinon.js',
      // Allow root import of `src/FOO` from ROOT/src.
      src: path.join(ROOT, 'src')
    }
  }),
  // enzyme webpack issue https://github.com/airbnb/enzyme/issues/47
  externals: {
    'cheerio': 'window',
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true,
    'react/addons': true
  },
  module: _.assign({}, prodCfg.module, {
    // enzyme webpack issue https://github.com/airbnb/enzyme/issues/47
    noParse: [
      /\/sinon\.js/
    ]
  }),
  devtool: 'source-map'
};
