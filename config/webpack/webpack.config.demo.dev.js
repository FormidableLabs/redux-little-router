/* eslint-disable strict */
'use strict';

const combineLoaders = require('webpack-combine-loaders');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const postcssImport = require('postcss-import');
const postcssReporter = require('postcss-reporter');
const cssnext = require('postcss-cssnext');

module.exports = {
  devServer: {
    contentBase: './demo',
    noInfo: false,
    historyApiFallback: true
  },

  output: {
    path: './demo',
    filename: 'main.js',
    publicPath: '/assets/'
  },

  cache: true,
  devtool: 'source-map',
  entry: {
    app: ['./demo/app']
  },
  stats: {
    colors: true,
    reasons: true
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: [/node_modules/],
        loader: require.resolve('babel-loader')
      },
      {
        // CSS modules
        test: /\.css$/,
        loader: ExtractTextPlugin.extract(
          require.resolve('style-loader'),
          combineLoaders([
            {
              loader: require.resolve('css-loader'),
              query: {
                autoprefixer: false,
                mergeRules: false, // disable or keyframes break
                modules: true,
                sourceMap: true,
                importLoaders: 1,
                localIdentName: '[local]___[hash:base64:5]',
                context: 'src'
              }
            },
            {
              loader: require.resolve('postcss-loader')
            }
          ])
        )
      }
    ]
  },
  plugins: [
    // Webpack DevServer does not support CSS file hashes in the names.
    // TODO: add hash in for production
    new ExtractTextPlugin(
      '[name].css',
      { allChunks: true }
    )
  ],
  postcss: () => {
    return [
      postcssImport,
      cssnext(),
      postcssReporter({
        throwError: true
      })
    ];
  }
};
