'use strict';

const postcssImport = require('postcss-import');
const cssnext = require('postcss-cssnext');
const reporter = require('postcss-reporter');

module.exports = {
  plugins: [
    postcssImport,
    cssnext(),
    reporter({
      throwError: true
    })
  ]
};
