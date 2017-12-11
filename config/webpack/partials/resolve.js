'use strict';

const { smart: mergeWebpackConfig } = require('webpack-merge');
const path = require('path');

module.exports = () => config => mergeWebpackConfig(config, {
  resolve: {
    // Alias `react` to copy in this repo's `node_modules`.
    // Solves an issue where Webpack includes multiple versions of React when using
    // npm link to install a package that also includes React as a dependency.
    //
    // http://www.justincarmony.com/blog/2015/04/02/webpack-react-multiple-versions-issues/
    alias: {
      'react': path.dirname(require.resolve("react/package.json"))
    }
  }
});
