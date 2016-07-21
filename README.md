# redux-little-router [![Build Status](https://travis-ci.org/FormidableLabs/redux-little-router.svg?branch=master)](https://travis-ci.org/FormidableLabs/redux-little-router) [![Coverage Status](https://coveralls.io/repos/github/FormidableLabs/redux-little-router/badge.svg?branch=master)](https://coveralls.io/github/FormidableLabs/redux-little-router?branch=master)

`redux-little-router` is a tiny router for Redux applications that lets the URL do the talking.

The router follows three basic principles:

- The URL is just another member of the state tree.
- URL changes are just plain actions.
- Route matching should be simple and extendable.

While the core router does not depend on any view library, it provides flexible React bindings and components.

Almost all of `redux-little-router`'s API is public. Check out the `export`s in [`index.js`](https://github.com/FormidableLabs/redux-little-router/blob/master/src/index.js).

## Redux usage

To hook into Redux applications, `redux-little-router` uses the following:

- A store enhancer that wraps the `history` module and adds current and previous router state to your store. The enhancer listens for location changes and dispatches rich actions containing the URL, parameters, and any custom data assigned to the route.
- Middleware that intercepts navigation actions that manipulate the location using `history`.
- A utility function, `initialStateForSSR`, that initializes state for the router given a URL and/or query object (pulled from an Express or Hapi route). 

### Wiring up the boilerplate

The following is an example of a `redux-little-router` setup that works on both the browser and the server. At the bare minimum, you'll need to install the store enhancer (`createStoreWithRouter`) and the middleware (`routerMiddleware`) into your Redux store.

```js
import { compose, createStore } from 'redux';
import {
  createStoreWithRouter,
  routerMiddleware,
  initialStateForSSR
} from 'redux-little-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';

import yourReducer from './your-app';

// A history instance for the store enhancer to wrap.
// History enhancers like `useBasename` and `useQueries` are supported.
// Use `createBrowserHistory` on the client and `createMemoryHistory` on the server.
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

// This is just a wrapper function for setting up router
// boilerplate that works on both server and client.
// You can pull `url` and `query` from your express or hapi routes!
const initializeStore = ({ history, routes, url, query }) => {
  const initialState = window.__SERVER_RENDERED_INITIAL_STATE || {
    router: initialStateForSSR({ history, routes, url, query })
  };

  return createStore(
    yourReducer,
    initialState,
    compose(
      createStoreWithRouter({
        routes, history
      }),
      applyMiddleware(
        routerMiddleware({ history })
      )
    )
  );
};
```

Often, you'll want to update state or trigger side effects after loading the initial URL. To maintain compatibility with other store enhancers (particularly ones that handle side effects, like `redux-loop` or `redux-saga`), we require this optional initial dispatch to happen in userland code by doing the following:

```js
import { initializeCurrentLocation } from 'redux-little-router';

// ...after creating your store
const initialLocation = store.getState().router;
if (initialLocation) {
  store.dispatch(initializeCurrentLocation(initialLocation));
}
```

### Provided actions and state

On location changes, the middleware dispatches a LOCATION_CHANGED action that contains at least the following properties:

```js
// For a URL matching /messages/:user
{
  url: '/messages/a-user-has-no-name',
  params: {
    user: 'a-user-has-no-name'
  },
  query: { // if your `history` instance uses `useQueries`
    some: 'thing'
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

  url: '/messages/a-user-has-no-name',
  params: {
    user: 'a-user-has-no-name'
  },
  query: {
    some: 'thing'
  },
  result: {
    arbitrary: 'data that you defined in your routes object!'
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

## React bindings and usage

`redux-little-router` provides the following to make React integration easier:

- A `<Fragment>` component that conditionally renders children based on current route and/or location conditions.
- A `<Link>` component that sends navigation actions to the middleware when tapped or clicked. `<Link>` respects default modifier key and right-click behavior. A sibling component, `<PersistentQueryLink>`, persists the existing query string on navigation
- A `provideRouter` HOC that passes down everything `<Fragment>` and `<Link>` need via context.

### `<Fragment>`
Think of `<Fragment>` as the midpoint of a "flexibility continuum" that starts with raw switch statements and ends with React Router's `<Route>` component. Fragments can live anywhere within the React tree, making split-pane or nested UIs easy to work with.

The simplest fragment is one that displays when a route is active:

```es6
<Fragment forRoute='/home/messages/:team'>
  <p>This is the team messages page!</p>
</Fragment>
```

You can also specify a fragment that displays on multiple routes:

```es6
<Fragment forRoutes={['/home/messages', '/home']}>
  <p>This displays in a couple of places!</p>
</Fragment>
```

Finally, you can match a fragment against anything in the current `location` object:

```es6
<Fragment withConditions={location => location.query.superuser}>
  <p>Superusers see this on all routes!</p>
</Fragment>
```

You can also use `withConditions` in conjunction with either `forRoute` or `forRoutes`.

### `<Link>`

Using the `<Link>` component is simple:

```es6
<Link className='anything' href='/yo'>
  Share Order
</Link>
```

Alternatively, you can pass in a [location descriptor](https://github.com/ReactTraining/history/blob/master/docs/Location.md#location-descriptors) to `href`. This is useful for passing query objects:

```es6
<Link className='anything' href={{
  pathname: '/home/messages/a-team?test=ing',
  query: {
    test: 'ing'
  }
}}>
  Share Order
</Link>
```

`<Link>` takes an optional valueless prop, `replaceState`, that changes the link navigation behavior from `pushState` to `replaceState` in the History API.

### `provideRouter`

Like React Router's `<Provider>`, you'll want to wrap `provideRouter` around your app's top-level component like so:

```es6
import React from 'react';
import ReactDOM from 'react-dom';
import { provideRouter } from 'redux-little-router';
import YourAppComponent from './';

const AppComponentWithRouter = provideRouter(YourAppComponent);

ReactDOM.render(<AppComponentWithRouter />, document.getElementById('root');
```

This allows `<Fragment>` and `<Link>` to obtain their `history` and `dispatch` instances without manual prop passing.

## Environment

`redux-little-router` requires an ES5 compatible environment (no IE8).

## Stability

`redux-little-router` is **alpha software**. Expect minor breaking API changes.
