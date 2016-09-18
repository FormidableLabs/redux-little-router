'use strict';

const path = require('path');
const compose = require('lodash/fp/compose');

const babel = require('../partials/babel');
const cssModules = require('../partials/css-modules');

const extendConfig = compose(
  babel(),
  cssModules()
);

module.exports = extendConfig({
  devServer: {
    contentBase: './demo/client',
    noInfo: false,
    historyApiFallback: true
  },

  output: {
    path: path.join(process.cwd(), 'demo/client'),
    filename: 'main.js',
    publicPath: '/assets/'
  },

  cache: true,
  devtool: 'source-map',
  entry: {
    app: ['./demo/client/app.js']
  },
  stats: {
    colors: true,
    reasons: true
  }
});
