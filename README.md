# redux-little-router

[![Build Status](https://travis-ci.org/FormidableLabs/redux-little-router.svg?branch=master)](https://travis-ci.org/FormidableLabs/redux-little-router) [![Codacy Badge](https://api.codacy.com/project/badge/Coverage/7a6d3ed461d44fc0a83122dcda06728d)](https://www.codacy.com/app/tyler_9/redux-little-router?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=FormidableLabs/redux-little-router&amp;utm_campaign=Badge_Coverage) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/7a6d3ed461d44fc0a83122dcda06728d)](https://www.codacy.com/app/tyler_9/redux-little-router?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=FormidableLabs/redux-little-router&amp;utm_campaign=Badge_Grade) <a href="https://overv.io/FormidableLabs/redux-little-router/board/"><img src="https://img.shields.io/badge/issues-board-green.svg" height="20" /></a>

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

To hook into Redux applications, `redux-little-router` uses a store enhancer that wraps the `history` module and adds current and previous router state to your store. The enhancer listens for location changes and dispatches rich actions containing the URL, parameters, and any custom data assigned to the route. `redux-little-router` also adds a middleware that intercepts navigation actions and calls their equivalent method in `history`.

### Wiring up the boilerplate

The following is an example of a `redux-little-router` setup that works for browser-rendered applications. For a server rendering example, check out our [advanced docs](ADVANCED.md).

```js
import { combineReducers, compose, createStore, applyMiddleware } from 'redux';
import { routerForBrowser } from 'redux-little-router';

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

// Install the router into the store for a browser-only environment.
// routerForBrowser is a factory method that returns a store
// enhancer and a middleware.
const {
  reducer,
  middleware,
  enhancer
} = routerForBrowser({
  // The configured routes. Required.
  routes,
  // The basename for all routes. Optional.
  basename: '/example'
})

const clientOnlyStore = createStore(
  combineReducers({ router: reducer, yourReducer }),
  initialState,
  compose(enhancer, applyMiddleware(middleware))
);
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

`redux-little-router` provides the following action creators for navigation:

```js
import { push, replace, go, goBack, goForward } from 'redux-little-router';

// `push` and `replace`
// 
// Equivalent to pushState and replaceState in the History API.
// If you installed the router with a basename, `push` and `replace`
// know to automatically prepend paths with it. Both action creators
// accept string and object arguments.
push('/messages');

// Parsed query string stored in the `query` field of router state
push('/messages?filter=business');

// Provided query object stringified into the `search` field of router state
replace({
  pathname: '/messages',
  query: {
    filter: 'business'
  }
});

// Optional second argument accepts a `persistQuery` field. When true,
// reuse the query object from the previous location instead of replacing
// or emptying it.
push({
  pathname: '/messages',
  query: {
    filter: 'business'
  }
}, {
  persistQuery: true
});

// Navigates forward or backward a specified number of locations
go(3);
go(-6);

// Equivalent to the browser back button
goBack();

// Equivalent to the browser forward button
goForward();
```

On location changes, the store enhancer dispatches a `LOCATION_CHANGED` action that contains at least the following properties:

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
  search: '?some=thing',
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
  search: '?some=thing',
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

`redux-little-router` assumes and requires that your root component is a direct or indirect child of `<Provider>` from  `react-redux`. Both `provideRouter` and `<RouterProvider>` automatically `connect()` to updates from the router state.

You can inspect the router state in any child component by using `connect()`:

```js
export default connect(state => ({
  router: state.router
}))(YourComponent);
```

### `<Fragment>`

Think of `<Fragment>` as the midpoint of a "flexibility continuum" that starts with raw switch statements and ends with React Router v3's `<Route>` component. Fragments can live anywhere within the React tree, making split-pane or nested UIs easy to work with.

The simplest fragment is one that displays when a route is active:

```jsx
<Fragment forRoute='/home/messages/:team'>
  <p>This is the team messages page!</p>
</Fragment>
```

You can also match a fragment against anything in the current `location` object:

```jsx
<Fragment withConditions={location => location.query.superuser}>
  <p>Superusers see this on all routes!</p>
</Fragment>
```

You can use `withConditions` in conjunction with `forRoute` to set strict conditions for when a `<Fragment>` should display.

`<Fragment>` lets you nest fragments to match your UI hierarchy to your route hierarchy, much like the `<Route>` component does in `react-router@v3`. Given a URL of `/home/bio/dat-boi`, and the following elements:

```jsx
<Fragment forRoute='/home'>
  <h1>Home</h1>
  <Fragment forRoute='/bio'>
    <h2>Bios</h2>
    <Fragment forRoute='/dat-boi'>
      <h3>Dat Boi</h3>
      <p>Something something whaddup</p>
    </Fragment>
  </Fragment>
</Fragment>
```

...React will render:

```html
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

`<Fragment>` makes basic component-per-page navigation easy:

```jsx
<Fragment forRoute='/'>
  <Fragment forRoute='/home'><Home /></Fragment>
  <Fragment forRoute='/about'><About /></Fragment>
  <Fragment forRoute='/messages'><Messages /></Fragment>
  <Fragment forRoute='/feed'><Feed /></Fragment>
</Fragment>
```

### `<Link>`

Using the `<Link>` component is simple:

```jsx
<Link className='anything' href='/yo'>
  Share Order
</Link>
```

Alternatively, you can pass in a location object to `href`. This is useful for passing query objects:

```jsx
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

```jsx
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

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { RouterProvider } from 'redux-little-router';
import YourAppComponent from './';

import createYourStore from './state';

ReactDOM.render(
  <RouterProvider store={createYourStore()}>
    <YourAppComponent />
  </RouterProvider>,
  document.getElementById('root')
);
```

## Environment

`redux-little-router` requires an ES5 compatible environment (no IE8).

## Stability

We consider `redux-little-router` to be **stable**. Any API changes will be incremental.

## Versioning

`redux-little-router` follows **strict semver**. Don't be alarmed by the high version number! Major version bumps represent _any_ breaking change, no matter how small, and do not represent a major shift in direction. We strive to make breaking changes small and compartmentalized.
