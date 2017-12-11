'use strict';

const path = require('path');
const compose = require('lodash/fp/compose');

const babelConfig = require('../partials/babel');
const cssConfig = require('../partials/css-modules');
const defineConfig = require('../partials/define');
const optimizeConfig = require('../partials/optimize');
const resolveConfig = require('../partials/resolve');
const statsConfig = require('../partials/stats');

const extendConfig = compose(
  babelConfig(),
  cssConfig({ production: true }),
  defineConfig({ 'process.env.NODE_ENV': 'production' }),
  optimizeConfig(),
  resolveConfig(),
  statsConfig()
);

module.exports = extendConfig({
  cache: true,
  context: path.resolve("demo/client"),
  entry: './app.js',
  output: {
    path: path.resolve('demo/dist'),
    publicPath: '/',
    filename: '[name].[hash].js'
  }
});
