'use strict';

const path = require('path');
const hook = require('css-modules-require-hook');

hook({
  generateScopedName: '[local]___[hash:base64:5]',
  rootDir: path.resolve(process.cwd(), 'src')
});

require('babel-register')();

const fs = require('fs');
const express = require('express');
const app = express();

const webpackDevMiddleware = require('webpack-dev-middleware');
const webpack = require('webpack');
const config = require('../../config/webpack/demo/webpack.config.demo.dev.js');

const Handlebars = require('handlebars');

const encode = require('ent/encode');

const renderToString = require('react-dom/server')
  .renderToString;

const redux = require('redux');
const routerForExpress = require('../../src')
  .routerForExpress;

const routes = require('../client/routes').default;
const wrap = require('../client/wrap').default;
const Root = require('../client/demo').default;

const createStore = redux.createStore;
const combineReducers = redux.combineReducers;
const compose = redux.compose;
const applyMiddleware = redux.applyMiddleware;

const PORT = 4567;

const templateFile = fs.readFileSync(path.join(__dirname, './index.hbs'));
const template = Handlebars.compile(templateFile.toString());

const compiler = webpack(config);

app.use(express.static('public'));

app.use(webpackDevMiddleware(compiler, {
  contentBase: './demo',
  headers: {
    'Access-Control-Allow-Origin': '*'
  },
  serverSideRender: true,
  stats: {
    chunks: false,
    children: false,
    colors: true,
    hash: false
  }
}));

app.use('/favicon.ico', (req, res) => res.end());

app.get('/*', (req, res) => {
  const initialState = {};
  const router = routerForExpress({
    routes,
    request: req
  });
  const store = createStore(
    combineReducers({ router: router.reducer }),
    initialState,
    compose(
      router.enhancer,
      applyMiddleware(router.middleware)
    )
  );

  const content = renderToString(wrap(store)(Root));

  const assets = res.locals.webpackStats.toJson().assetsByChunkName.app;
  const css = assets.filter(asset => path.extname(asset) === '.css');
  const js = assets.filter(asset => path.extname(asset) === '.js');
  return res.send(template({
    initialState: encode(JSON.stringify(initialState)),
    css, js, content
  }));
});

app.listen(PORT, error => {
  if (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  } else {
    // eslint-disable-next-line no-console
    console.info(`Listening on port ${PORT}`);
  }
});
