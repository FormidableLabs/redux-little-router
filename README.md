# redux-little-router [![Build Status](https://travis-ci.org/FormidableLabs/redux-little-router.svg?branch=master)](https://travis-ci.org/FormidableLabs/redux-little-router) [![Coverage Status](https://coveralls.io/repos/github/FormidableLabs/redux-little-router/badge.svg?branch=master)](https://coveralls.io/github/FormidableLabs/redux-little-router?branch=master)

`redux-little-router` is a tiny router for Redux applications that lets the URL do the talking.

The router follows three basic principles:

- The URL is just another member of the state tree.
- URL changes are just plain actions.
- Route matching should be simple and extendable.

While the core router does not depend on any view library, it provides flexible React bindings and components.

## Why another router?

To understand why `redux-little-router` exists, check out our blog series, "Let the URL do the Talking":

[Part 1](http://formidable.com/blog/2016/07/11/let-the-url-do-the-talking-part-1-the-pain-of-react-router-in-redux/)
[Part 2](http://formidable.com/blog/2016/07/19/let-the-url-do-the-talking-part-2-bargaining-and-acceptance-with-redux-and-react-router/)
[Part 3](http://formidable.com/blog/2016/07/25/let-the-url-do-the-talking-part-3-empower-the-url-with-redux-little-router/)

While React Router is a great, well-supported library, it hoards URL state within the view layer and makes certain Redux patterns difficult, if not impossible. [This chart](http://imgur.com/a/Trlzw) outlines a major issue in accessing URL state from outside of React Router.

`redux-little-router` makes URL state a first-class citizen of your Redux store and abstracts cross-browser navigation and routing into a pure Redux API.

## Redux usage

To hook into Redux applications, `redux-little-router` uses a store enhancer that wraps the `history` module and adds current and previous router state to your store. The enhancer listens for location changes and dispatches rich actions containing the URL, parameters, and any custom data assigned to the route. It also intercepts navigation actions and calls their equivalent method in `history`.

### Wiring up the boilerplate

The following is an example of a `redux-little-router` setup that works on both the browser and the server. At the bare minimum, you'll need to install the store enhancer (`createStoreWithRouter`) into your Redux store.

```js
import { compose, createStore } from 'redux';
import { createStoreWithRouter } from 'redux-little-router';

import yourReducer from './your-app';

// Define your routes in a route-to-anything hash like below.
// The value of the route key can be any serializable data.
// This data gets attached to the `router` key of the state
// tree when its corresponding route is matched and dispatched.
// Useful for page titles and other route-specific data.

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

// This is an example of initializing the router in a client-only
// single-page app. Passing in at least the `pathname` will allow
// `createStoreWithRouter` to automatically setup the initial state
// for the first browser location.
const clientOnlyStore = createStore(
  yourReducer,
  initialState,
  createStoreWithRouter({
    // The configured routes. Required.
    routes,
    // The basename for all routes. Optional.
    basename: '/example',
    // The initial URL. Required in all cases except for when
    // rehydrating the state tree on the client after a server render.
    pathname: '/home',
    // The initial query string object. Optional.
    query: {
      ex: 'ample'
    }
  })
);

// This is a wrapper function for setting up router boilerplate
// for server-rendered universal React applications.

// You can pull `url` and `query` from your express or hapi routes.
// The below example uses a URL object from an express request.
const initializeStore = ({ routes, requestUrl, requestQuery }) => {
  // Grab the initial state the server attached to your template after render
  const initialState = INITIAL_STATE_FROM_SERVER_RENDER;

  // Notice that `pathname` isn't required when rehydrating
  // the store since redux-little-router already added
  // the pathname to the initial state.
  const routerOptions = initialState ? {
    routes,
    basename: BASENAME_FROM_SERVER_RENDER
  } : {
    routes,
    basename: requestUrl.baseUrl,
    pathname: requestUrl.pathname,
    query: initialQuery,
    forServerRender: true // required for server renders!
  };

  return createStore(
    yourReducer,
    initialState,
    createStoreWithRouter(routerOptions)
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

On location changes, the store enhancer dispatches a LOCATION_CHANGED action that contains at least the following properties:

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
    params: {},
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

`redux-little-router` assumes and requires that `react-redux` is installed for any of your components that consume `<Fragment>` or `<Link>`. You can access the router state using `react-redux`'s `connect()`:

```js
export default connect(state => ({
  router: state.router
}))(YourComponent);
```

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

### `provideRouter` or `<RouterProvider>`

Like React Router's `<Router>` component, you'll want to wrap `provideRouter` around your app's top-level component like so:

```es6
import React from 'react';
import ReactDOM from 'react-dom';
import { provideRouter } from 'redux-little-router';
import YourAppComponent from './';

import createYourStore from './state';

const AppComponentWithRouter = provideRouter({
  store: createYourStore()
})(YourAppComponent);

ReactDOM.render(<AppComponentWithRouter />, document.getElementById('root');
```

This allows `<Fragment>` and `<Link>` to obtain their `history` and `dispatch` instances without manual prop passing.

If you'd rather use a plain component instead of a higher-ordered component, use `<RouterProvider>` like so:

```es6
import React from 'react';
import ReactDOM from 'react-dom';
import { RouterProvider } from 'redux-little-router';
import YourAppComponent from './';

import createYourStore from './state';

ReactDOM.render(
  <RouterProvider store={createYourStore()}>
    <YourComponent />
  </RouterProvider>
  document.getElementById('root');
)
```

## Environment

`redux-little-router` requires an ES5 compatible environment (no IE8).

## Stability

`redux-little-router` is **alpha software**. Expect minor breaking API changes.
