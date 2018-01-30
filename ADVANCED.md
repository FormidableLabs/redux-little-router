# Advanced Docs

## Server Rendering

`redux-little-router` supports React server rendering with an Express or Hapi adapter.

Make sure to read http://redux.js.org/docs/recipes/ServerRendering.html to understand how the server/client Redux boilerplate works.

Here's what the setup looks like on the server (assuming Node 6 LTS):

### Express

```js
const express = require('express');
const app = express();
const { routerForExpress } = require('redux-little-router');

const {
  combineReducers,
  createStore,
  compose,
  applyMiddleware
} = require('redux');

const routes = {
  '/': {
    '/whatever': {
      title: 'Whatever'
    }
  }
};

app.use('/*', (req, res) => {
  // Create the Redux store, passing in the Express
  // request to the routerForExpress factory.
  //
  // If you're using an Express sub-router,
  // routerForExpress will infer the basename
  // from req.baseUrl!
  //
  const { reducer, middleware, enhancer } = routerForExpress({
    routes,
    request: req
  });

  const store = createStore(
    combineReducers({ router: reducer }),
    { what: 'ever' },
    compose(enhancer, applyMiddleware(middleware))
  );

  // ...then renderToString() your components as usual,
  // passing your new store to your <Provider> component.
  //
  // Don't forget to attach your ESCAPED initialState to
  // a script tag in your template that attaches to
  // something like window.__INITIAL_STATE.
});
```

### Hapi

```js
const hapi = require('hapi');
const server = new Hapi.Server();
const { routerForHapi } = require('redux-little-router');

const {
  combineReducers,
  createStore,
  compose,
  applyMiddleware
} = require('redux');

const routes = {
  '/': {
    '/whatever': {
      title: 'Whatever'
    }
  }
};

server.route({
  method: 'GET',
  path: '/{wild*}',
  handler: (request, reply) => {
    // Create the Redux store, passing in the Hapi
    // request to the routerForHapi factory.

    const { reducer, middleware, enhancer } = routerForHapi({
      routes,
      request
    });

    const store = createStore(
      reducer,
      { what: 'ever' },
      compose(enhancer, applyMiddleware(middleware))
    );

    // ...then renderToString() your components as usual,
    // passing your new store to your <Provider> component.
    //
    // Don't forget to attach your ESCAPED initialState to
    // a script tag in your template that attaches to
    // something like window.__INITIAL_STATE.
  }
});
```

There's not much involved on the client side, post-server render:

```js
import { createStore, compose, applyMiddleware } from 'redux';
import { routerForBrowser } from 'redux-little-router';

// The same routes that you used on the server.
// You probably want to keep these in a separate file!
const routes = {
  '/': {
    '/whatever': {
      title: 'Whatever'
    }
  }
};

const { reducer, enhancer, middleware } = routerForBrowser({ routes });

const store = createStore(
  combineReducers({ router: reducer }),
  window.__INITIAL_STATE,
  compose(enhancer, applyMiddleware(middleware))
);

// ...then render() your components as usual,
// passing your new store to your <Provider> component.
```

If you're using an Express sub-router, you should extract the inferred `basename` from `window.__INITIAL_STATE.router.basename` and pass it to `routerForBrowser`.

## Code Splitting

If you're using `Fragment`, you shouldn't have any restrictions on component-level code splitting. If you rely on static routes, you'll need to use the `replaceRoutes` action creator to update your routes after loading a component with new routes. `replaceRoutes` has no opinions on route updates and obliterates any existing routes, so you likely want to use `redux-thunk` to merge your new routes in:

```js
import { merge } from 'lodash';
import { replaceRoutes } from 'redux-little-router';

const mergeRoutes = newRoutes => (dispatch, getState) => {
  const currentRoutes = getState().routes;
  return dispatch(replaceRoutes(merge(currentRoutes, newRoutes)));
};

// Later, maybe in a `connect()ed component`
loadSomeAsyncRoutes().then(routes => dispatch(mergeRoutes()));
```
