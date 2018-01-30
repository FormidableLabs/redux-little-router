'use strict';

const plugin = require('webpack-partial/plugin').default;
const StatsWriterPlugin = require('webpack-stats-plugin').StatsWriterPlugin;

module.exports = () =>
  plugin(
    new StatsWriterPlugin({
      filename: '../stats/stats.json'
    })
  );
