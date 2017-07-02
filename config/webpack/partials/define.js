'use strict';

const _ = require('lodash');
const plugin = require('webpack-partial/plugin').default;
const DefinePlugin = require('webpack').DefinePlugin;

module.exports = function (opts) {
  opts = _.defaults(opts, {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  });

  const define = _.reduce(opts, (accumulator, value, key) => {
    return _.set(accumulator, key, JSON.stringify(value));
  }, {});

  return plugin(new DefinePlugin(define));
};
