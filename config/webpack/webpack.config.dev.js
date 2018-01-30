'use strict';

const webpack = require('webpack');
const config = require('./webpack.config');

// **WARNING**: Mutates base configuration.
// We do this because lodash isn't available in `production` mode.
config.output.filename = config.output.filename.replace(/\.min\.js$/, '.js');
config.plugins = [new webpack.SourceMapDevToolPlugin('[file].map')];

// Export mutated base.
module.exports = config;
