# Advanced Docs

## Server Rendering
`redux-little-router` supports React server rendering with an Express adapter, with plans to support Hapi in the future.

Make sure to read http://redux.js.org/docs/recipes/ServerRendering.html to understand how the server/client Redux boilerplate works.

Here's what the setup looks like on the server:

```js
const express = require('express');
const app = express();

const createStore = require('redux').createStore;
const routerForExpress = require('redux-little-router')
  .routerForExpress;

const routes = {
  '/': {
    '/whatever': {
      title: 'Whatever'
    }
  }
};

app.use('/*', (req, res) => {
  // Create the Redux store, passing in the
  // Express request to the store enhancer.
  // 
  // If you're using an Express sub-router,
  // routerForExpress will infer the basename
  // from req.baseUrl!
  const store = createStore(
    state => state,
    { what: 'ever' },
    routerForExpress({
      routes,
      request: req
    })
  );

  // ...then renderToString() your components as usual,
  // passing your new store to your <Provider> component.
  // 
  // Don't forget to attach your ESCAPED initialState to
  // a script tag in your template that attaches to
  // something like window.__INITIAL_STATE.
});
```

There's not much involved on the client side, post-server render:

```js
import { createStore } from 'redux';
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

const store = createStore(
  yourReducer,
  window.__INITIAL_STATE,
  routerForBrowser({ routes })
);

// ...then render() your components as usual,
// passing your new store to your <Provider> component.
```

If you're using an Express sub-router, you should extract the inferred `basename` from `window.__INITIAL_STATE.router.basename` and pass it to `routerForBrowser`.
