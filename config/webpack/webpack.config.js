'use strict';

const path = require('path');
const webpack = require('webpack');

// Replace with `__dirname` if using in project root.
const ROOT = process.cwd();
const SRC = path.join(ROOT, 'src');
const CLIENT = path.join(ROOT, 'test');

// **Little Hacky**: Infer the filename and library name from the package name.
//
// Assumptions:
// - `package.json`'s `name` field is name of dist files.
// - PascalCased version of that name is exported class name.
const PKG = require(path.join(ROOT, 'package.json'));
const libPath = (PKG.name || '').toLowerCase();
if (!libPath) {
  throw new Error('Need package.json:name field');
}
// PascalCase (with first character capitalized).
const libName = libPath
  .replace(/^\s+|\s+$/g, '')
  .replace(/(^|[-_ ])+(.)/g, (match, first, second) => {
    // Second match group is the character we want to change. Throw away first.
    return second.toUpperCase();
  });

module.exports = {
  cache: true,
  context: SRC,
  entry: './index.js',
  externals: [
    {
      react: {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react'
      }
    },
    {
      radium: {
        root: 'Radium',
        commonjs2: 'radium',
        commonjs: 'radium',
        amd: 'radium'
      }
    }
  ],
  output: {
    path: path.join(ROOT, 'dist'),
    filename: `${libPath}.min.js`,
    library: libName,
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        // Use include specifically of our sources.
        // Do _not_ use an `exclude` here.
        include: [SRC, CLIENT],
        // **Note**: Cannot use shorthand `'babel-loader'` or `'babel'` when
        // we are playing around with `NODE_PATH` in builder. Manually
        // resolve path.
        use: require.resolve('babel-loader')
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },

      sourceMap: true
    }),
    new webpack.DefinePlugin({
      // Signal production, so that webpack removes non-production code that
      // is in condtionals like: `if (process.env.NODE_ENV === 'production')`
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map'
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ]
};
