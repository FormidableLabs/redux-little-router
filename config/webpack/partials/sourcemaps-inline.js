'use strict';

const { smart: mergeWebpackConfig } = require('webpack-merge');

module.exports = () => config =>
  mergeWebpackConfig(config, {
    devtool: 'cheap-module-source-map'
  });
