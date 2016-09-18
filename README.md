# redux-little-router [![Build Status](https://travis-ci.org/FormidableLabs/redux-little-router.svg?branch=master)](https://travis-ci.org/FormidableLabs/redux-little-router) [![Codacy Badge](https://api.codacy.com/project/badge/Coverage/7a6d3ed461d44fc0a83122dcda06728d)](https://www.codacy.com/app/tyler_9/redux-little-router?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=FormidableLabs/redux-little-router&amp;utm_campaign=Badge_Coverage) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/7a6d3ed461d44fc0a83122dcda06728d)](https://www.codacy.com/app/tyler_9/redux-little-router?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=FormidableLabs/redux-little-router&amp;utm_campaign=Badge_Grade)
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

`react-router-redux` is meant _only_ to enable time-travel debugging in React Router and doesn't allow you to safely access URL state. `redux-router`, while allowing you to access URL state, is experimental, lags behind React Router releases, and recommends `react-router-redux` in its `README`.

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
  '/messages': {
    title: 'Message'
  },
  '/messages/:user': {
    title: 'Message History'
  },
  // You can also define nested route objects!
  // Just make sure each route key starts with a slash.
  '/': {
    title: 'Home',
    '/bio': {
      title: 'Biographies',
      '/:name': {
        title: 'Biography for:'
      }
    }
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
    query: requestQuery,
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
  pathname: '/messages/a-user-has-no-name',
  route: '/messages/:user',
  params: {
    user: 'a-user-has-no-name'
  },
  query: { // if your `history` instance uses `useQueries`
    some: 'thing'
  },
  result: {
    arbitrary: 'data that you defined in your routes object!'
    parent: { // for nested routes only
      // contains the result of the parent route,
      // which contains each other parent route's
      // result recursively
    }
  }
}
```

Your custom middleware can intercept this action to dispatch new actions in response to URL changes.

The reducer consumes this action and adds the following to the root of the state tree on the `router` property:

```js
{
  pathname: '/messages/a-user-has-no-name',
  route: '/messages/:user',
  params: {
    user: 'a-user-has-no-name'
  },
  query: {
    some: 'thing'
  },
  result: {
    arbitrary: 'data that you defined in your routes object!',
    parent: { /* the parent route's result */ },
  },
  previous: {
    pathname: '/messages',
    route: '/messages',
    params: {},
    query: {},
    result: {
      more: 'arbitrary data that you defined in your routes object!'
      parent: { /* the parent route's result */ }
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

`redux-little-router` assumes and requires that your root component is wrapped in `<Provider>` from  `react-redux`. Both `provideRouter` and `<RouterProvider>` automatically `connect()` to updates from the router state.

You can inspect the router state in any child component by using `connect()`:

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

You can also match a fragment against anything in the current `location` object:

```es6
<Fragment withConditions={location => location.query.superuser}>
  <p>Superusers see this on all routes!</p>
</Fragment>
```

You can use `withConditions` in conjunction with `forRoute` to set strict conditions for when a `<Fragment>` should display.

Two types of fragments exist: `<RelativeFragment>` (new to 9.0.0) and `<AbsoluteFragment>`. You can use either by doing the following:

```js
import { RelativeFragment as Fragment } from 'redux-little-router';
// or
import { AbsoluteFragment as Fragment } from 'redux-little-router';
```

`<RelativeFragment>` lets you nest fragments to match your UI hierarchy to your route hierarchy, much like the `<Route>` component does in `react-router`. Given a URL of `/home/bio/dat-boi`, and the following elements:

```js
<RelativeFragment forRoute='/home'>
  <h1>Home</h1>
  <RelativeFragment forRoute='/bio'>
    <h2>Bios</h2>
    <RelativeFragment forRoute='/dat-boi'>
      <h3>Dat Boi</h3>
      <p>Something something whaddup</p>
    </RelativeFragment>
  </RelativeFragment>
</RelativeFragment>
```

...React will render:

```js
<div>
  <h1>Home</h1>
    <div>
      <h2>Bios</h2>
        <div>
          <h3>Dat Boi</h3>
          <p>Something something whaddup<p>
        </div>
    </div>
</div>
```

`<RelativeFragment>` makes basic component-per-page navigation easy:

```js
<Fragment forRoute='/'>
  <Fragment forRoute='/home'><Home /></Fragment>
  <Fragment forRoute='/about'><About /></Fragment>
  <Fragment forRoute='/messages'><Messages /></Fragment>
  <Fragment forRoute='/feed'><Feed /></Fragment>
</Route>
```

`<AbsoluteFragment>`s do not communicate with their parent or child routes like `<RelativeFragment>`s do. The route you pass to `forRoute` must match an exact route in your routes configuration, and are analgous to absolute URLs (they are not "relative" to the `forRoute`s of any other fragment in the hierarchy).

`<AbsoluteFragment>` accepts an additional `forRoutes` prop that allows the fragment to display on multiple routes:

```es6
<Fragment forRoutes={['/home/messages', '/home']}>
  <p>This displays in a couple of places!</p>
</Fragment>
```

When in doubt, use `<RelativeFragment>`. `<AbsoluteFragment>` may be deprecated in a future release.

### `<Link>`

Using the `<Link>` component is simple:

```es6
<Link className='anything' href='/yo'>
  Share Order
</Link>
```

Alternatively, you can pass in a [location descriptor](https://github.com/mjackson/history/blob/9a5102c38a161f00c6ea027a88b87b0328b5dc93/docs/Location.md#location-descriptors) to `href`. This is useful for passing query objects:

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

We consider `redux-little-router` to be **stable**. Any API changes will be incremental.

## Versioning

`redux-little-router` follows **strict semver**. Don't be alarmed by the high version number! Major version bumps represent _any_ breaking change, no matter how small, and do not represent a major shift in direction. We strive to make breaking changes small and compartmentalized.
