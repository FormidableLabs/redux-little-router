# redux-little-router

[![Build Status](https://travis-ci.org/FormidableLabs/redux-little-router.svg?branch=master)](https://travis-ci.org/FormidableLabs/redux-little-router) [![codecov](https://codecov.io/gh/FormidableLabs/redux-little-router/branch/master/graph/badge.svg)](https://codecov.io/gh/FormidableLabs/redux-little-router) <a href="https://overv.io/FormidableLabs/redux-little-router/board/"><img src="https://img.shields.io/badge/issues-board-green.svg" height="20" /></a> [![npm](https://img.shields.io/npm/v/redux-little-router.svg)]() [![npm (tag)](https://img.shields.io/npm/v/redux-little-router/next.svg)]()

`redux-little-router` is a tiny router for Redux applications that lets the URL do the talking.

The router follows three basic principles:

* The URL is just another member of the state tree.
* URL changes are just plain actions.
* Route matching should be simple and extendable.

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
// The value of the route key can be any serializable data,
// including an empty object.

// This data gets attached to the `router.result` key of the state
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
const { reducer, middleware, enhancer } = routerForBrowser({
  // The configured routes. Required.
  routes,
  // The basename for all routes. Optional.
  basename: '/example'
});

const clientOnlyStore = createStore(
  combineReducers({ router: reducer, yourReducer }),
  initialState,
  compose(enhancer, applyMiddleware(middleware))
);
```

Often, you'll want to update state or trigger side effects after loading the initial URL. To maintain compatibility with other store enhancers (particularly ones that handle side effects, like `redux-loop` or `redux-saga`), we require this optional initial dispatch to happen in client code by doing the following:

```js
import { initializeCurrentLocation } from 'redux-little-router';

// ...after creating your store
const initialLocation = store.getState().router;
if (initialLocation) {
  store.dispatch(initializeCurrentLocation(initialLocation));
}
```

### Provided actions and state

`redux-little-router` provides the following **action creators** for navigation:

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
push(
  {
    pathname: '/messages',
    query: {
      filter: 'business'
    }
  },
  {
    persistQuery: true
  }
);

// Navigates forward or backward a specified number of locations
go(3);
go(-6);

// Equivalent to the browser back button
goBack();

// Equivalent to the browser forward button
goForward();

// Creates a function that blocks navigation with window.confirm when returning a string.
// You can customize how the prompt works by passing a `historyOptions` option with a
// `getUserConfirmation` function to `routerForBrowser`, `routerForExpress`, etc.
// See https://www.npmjs.com/package/history#blocking-transitions
block((location, action) => {
  if (location.pathname === '/messages') {
    return 'Are you sure you want to leave the messages view?';
  }
});

// Removes the previous `block()`.
unblock();
```

Note: if you used the vanilla action types prior to `v13`, you'll need to migrate to using the public action creators.

These actions will execute once dispatched. For example, here's how to redirect using a [thunk](https://github.com/gaearon/redux-thunk):

```js
import { push } from 'redux-little-router';

export const redirect = href => dispatch => {
  dispatch(push(href));
};
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

* A `<Fragment>` component that conditionally renders children based on current route and/or location conditions.
* A `<Link>` component that sends navigation actions to the middleware when tapped or clicked. `<Link>` respects default modifier key and right-click behavior. A sibling component, `<PersistentQueryLink>`, persists the existing query string on navigation.

Instances of each component automatically `connect()` to the router state with `react-redux`.

You can inspect the router state in any child component by using `connect()`:

```js
const mapStateToProps = state => ({ router: state.router });
export default connect(mapStateToProps)(YourComponent);
```

### `<Fragment>`

Think of `<Fragment>` as the midpoint of a "flexibility continuum" that starts with raw switch statements and ends with React Router v3's `<Route>` component. Fragments can live anywhere within the React tree, making split-pane or nested UIs easy to work with.

The simplest fragment is one that displays when a route is active:

```jsx
<Fragment forRoute="/home/messages/:team">
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

To show a `Fragment` when no other `Fragment`s match a route, use `<Fragment forNoMatch />`.

`<Fragment>` lets you nest fragments to match your UI hierarchy to your route hierarchy, much like the `<Route>` component does in `react-router@v3`. Given a URL of `/about/bio/dat-boi`, and the following elements:

```jsx
<Fragment forRoute="/about">
  <div>
    <h1>About</h1>
    <Fragment forRoute="/bio">
      <div>
        <h2>Bios</h2>
        <Fragment forRoute="/dat-boi">
          <div>
            <h3>Dat Boi</h3>
            <p>Something something whaddup</p>
          </div>
        </Fragment>
      </div>
    </Fragment>
  </div>
</Fragment>
```

...React will render:

```html
<div>
  <h1>About</h1>
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
<Fragment forRoute="/">
  <div>
    <Fragment forRoute="/">
      <Home />
    </Fragment>
    <Fragment forRoute="/about">
      <About />
    </Fragment>
    <Fragment forRoute="/messages">
      <Messages />
    </Fragment>
    <Fragment forRoute="/feed">
      <Feed />
    </Fragment>
  </div>
</Fragment>
```

### `<Link>`

Using the `<Link>` component is simple:

```jsx
<Link className="anything" href="/yo">
  Share Order
</Link>
```

Alternatively, you can pass in a location object to `href`. This is useful for passing query objects:

```jsx
<Link
  className="anything"
  href={{
    pathname: '/home/messages/a-team?test=ing',
    query: {
      test: 'ing'
    }
  }}
>
  Share Order
</Link>
```

To change how `<Link>` renders when its `href` matches the current location (i.e. the link is "active"), use `activeProps`. For example, you can add `className` to `activeProps` to use a different CSS class when the link is active:

```jsx
<Link
  href="/wat"
  className="normal-link"
  activeProps={{ className: 'active-link' }}
>
  Wat
</Link>
```

`<Link>` takes an optional valueless prop, `replaceState`, that changes the link navigation behavior from `pushState` to `replaceState` in the History API.

## Use with `immutable`

`redux-little-router` supports the use of immutable.js in tandem with an `immutable`-aware `combineReducers` function like provided by [`redux-immutable`](https://github.com/gajus/redux-immutable). To use it, you will need to import the immutable version of the router or component you want to use. For instance,

```js
import { immutableRouterForBrowser, ImmutableLink } from 'redux-little-router/es/immutable';
import { combineReducers } from 'redux-immutable';

const { reducer, enhancer, middleware } = immutableRouterForBrowser({ routes });

const store = createStore(
  combineReducers({ router: reducer, ... }),
  ...
);
```

Depending on your environment, you might need to modify the import statement further. In that case, here are some tips:

```js
// works: ESM (preferred for webpack2+)
import { immutableRouterForBrowser } from 'redux-little-router/es/immutable';

// works: CJS (preferred for webpack1 or Node.js)
import { immutableRouterForBrowser } from 'redux-little-router/lib/immutable';

// DOESN'T WORK
import { immutableRouterForBrowser } from 'redux-little-router/immutable';
```

## Environment

`redux-little-router` requires an ES5 compatible environment (no IE8).

## Stability

We consider `redux-little-router` to be **stable**. Any API changes will be incremental.

## Versioning

`redux-little-router` follows **strict semver**. Don't be alarmed by the high version number! Major version bumps represent _any_ breaking change, no matter how small, and do not represent a major shift in direction. We strive to make breaking changes small and compartmentalized.

## Contributing

We welcome community contributions! We have standardized our dev experience on [`yarn`](https://yarnpkg.com/) so make sure to have that installed.

```sh
$ git clone git@github.com:FormidableLabs/redux-little-router.git
$ cd redux-little-router
$ yarn install
```

After any changes and before a PR, make sure to pass our build and quality checks:

```sh
$ yarn run build
$ yarn run check
```

When ready for release, we use an `npm version` workflow:

```sh
$ npm version <major|minor|patch|ACTUAL_VERSION_NUMBER>
$ npm publish
$ git push && git push --tags
```

After publishing, consider drafting some [release notes](https://github.com/FormidableLabs/redux-little-router/releases) to let the world know about all the great new features!

## Community

* [react-redux-boiler](https://github.com/justrossthings/react-redux-boiler)
* [hoc-little-router](https://github.com/Trampss/hoc-little-router)
