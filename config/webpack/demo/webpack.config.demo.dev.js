'use strict';

const path = require('path');
const compose = require('lodash/fp/compose');

const babel = require('../partials/babel');
const cssModules = require('../partials/css-modules');
const sourceMaps = require('../partials/sourcemaps-inline');

const extendConfig = compose(
  babel(),
  cssModules(),
  sourceMaps()
);

module.exports = extendConfig({
  devServer: {
    contentBase: './demo/client',
    noInfo: false,
    historyApiFallback: true
  },

  output: {
    path: path.resolve('demo/client'),
    filename: 'main.js',
    publicPath: '/assets/'
  },

  cache: true,
  entry: {
    app: ['./demo/client/app.js']
  },
  stats: {
    colors: true,
    reasons: true
  }
});
