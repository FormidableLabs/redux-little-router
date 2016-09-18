'use strict';

const mergeWebpackConfig = require('webpack-partial').default;
const StatsWriterPlugin = require('webpack-stats-plugin').StatsWriterPlugin;

module.exports = function () {
  return function (config) {
    return mergeWebpackConfig(config, {
      plugins: [
        new StatsWriterPlugin({
          filename: '../stats/stats.json'
        })
      ]
    });
  };
};
