'use strict';

const mergeWebpackConfig = require('webpack-partial').default;
const path = require('path');

module.exports = function () {
  return function (config) {
    return mergeWebpackConfig(config, {
      resolve: {
        // Alias `react` to copy in this repo's `node_modules`.
        // Solves an issue where Webpack includes multiple versions of React when using
        // npm link to install a package that also includes React as a dependency.
        //
        // http://www.justincarmony.com/blog/2015/04/02/webpack-react-multiple-versions-issues/
        alias: {
          'react': path.resolve(process.cwd(), 'node_modules/react')
        },
        extensions: ['', '.js', '.jsx']
      }
    });
  };
};
