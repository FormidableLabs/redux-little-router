# redux-little-router [![Build Status](https://travis-ci.org/FormidableLabs/redux-little-router.svg?branch=master)](https://travis-ci.org/FormidableLabs/redux-little-router) [![Coverage Status](https://coveralls.io/repos/github/FormidableLabs/redux-little-router/badge.svg?branch=master)](https://coveralls.io/github/FormidableLabs/redux-little-router?branch=master)

`redux-little-router` is a tiny router for Redux applications that lets the URL do the talking.

The router follows three basic principles:

- The URL is just another member of the state tree.
- URL changes are just plain actions.
- Route matching should be simple and extendable.

The router consists of:

- Middleware that wraps the `history` module. The middleware listens for location changes and dispatches rich actions containing the URL, parameters, and any custom data assigned to the route. The middleware also intercepts navigation actions that manipulate the location using `history`.
- A reducer that adds both the current and previous location to the state tree after the middleware dispatches location change actions.
- A `<Link>` component that sends navigation actions to the middleware when tapped or clicked.
- A store enhancer that glues everything together for you.

## Usage

```js
import { createStore } from 'redux';
import { createStoreWithRouter } from 'redux-little-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';

import yourReducer from './your-app';

// A history instance for the middleware to wrap.
// History enhancers like `useBasename` are supported.
const history = createBrowserHistory();

// Arbitrary data to add to the state tree when a route is
// matched and dispatched. Useful for page titles and other
// route-specific data.

// Uses https://github.com/snd/url-pattern for URL matching
// and parameter extraction.
const routes = {
  '/': {
    title: 'Home'
  },
  '/messages': {
    title: 'Message'
  },
  '/messages/:user': {
    title: 'Message History'
  }
};

const initialState = {};
const middleware = [ /* any custom middleware */ ];

const store = createStore(
  yourReducer,
  initialState,
  
  // Pass your custom middleware into createStoreWithRouter
  // as shown below. This ensures that the router middleware
  // is at the beginning of the chain.
  createStoreWithRouter({
    middleware, routes, history
  })
);
```

If you find the store enhancer heavy-handed, feel free to import the middleware, reducer, and action types directly. Here are the library's exports:

```js
export {
  createStoreWithRouter, // Store enhancer
  routerMiddleware,
  routerReducer,
  Link, // React component for navigating
  locationDidChange, // Action creator for LOCATION_CHANGED
  LOCATION_CHANGED, // Fired when the browser location changes
  
  // Actions that correspond to the methods in `history`
  PUSH,
  REPLACE,
  GO,
  GO_FORWARD,
  GO_BACK
};
```

*A caveat to direct imports:* the store enhancer dispatches an initial LOCATION_CHANGED action if you add initial state for a route so that consumers can deterministically intercept all URLs. If you choose not to use the store enhancer, you must dispatch this action yourself immediately after creating the store!

Using the `<Link>` component is simple:

```js
<Link
  className='anything'
  href='/yo'
  
  // Pass these down from your smart component
  // at the same time you create your Redux store
  dispatch={this.props.dispatch}
  history={this.props.history}
>
  Share Order
</Link>
```

`<Link>` takes an optional valueless prop, `replaceState`, that changes the link navigation behavior from `pushState` to `replaceState` in the History API.

## Provided actions and state

On location changes, the middleware dispatches a LOCATION_CHANGED action with the following payload:

```js
// For a URL matching /messages/:user
{
  url: '/messages/a-user-has-no-name',
  params: {
    user: 'a-user-has-no-name'
  },
  result: {
    arbitrary: 'data that you defined in your routes object!'
  }
}
```

Your custom middleware can intercept this action to dispatch new actions in response to URL changes.

The reducer consumes this action and adds the following to the root of the state tree on the `router` property:

```js
{
  current: {
    url: '/messages/a-user-has-no-name',
    params: {
      user: 'a-user-has-no-name'
    },
    result: {
      arbitrary: 'data that you defined in your routes object!'
    }
  },
  previous: {
    url: '/messages',
    params: {}.
    result: {
      more: 'arbitrary data that you defined in your routes object!'
    }
  }
}
```

Your custom reducers or selectors can derive a large portion of your app's state from the URLs in the `router` property.

## Stability

While the library's version number is high, we still consider this alpha software due to the likeliness of future breaking API changes.
