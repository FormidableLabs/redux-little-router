// @flow
import {
  LOCATION_CHANGED,
  PUSH,
  REPLACE,
  GO,
  GO_BACK,
  GO_FORWARD,
  BLOCK,
  UNBLOCK
} from './types';

import {
  push,
  replace,
  go,
  goBack,
  goForward,
  initializeCurrentLocation,
  block,
  unblock
} from './actions';

import routerForBrowser from './environment/browser-router';
import routerForExpress from './environment/express-router';
import routerForHapi from './environment/hapi-router';

import provideRouter, { RouterProvider } from './components/provider';
import { Link, PersistentQueryLink } from './components/link';
import Fragment from './components/fragment';

export {
  // High-level Redux API
  routerForBrowser,
  routerForExpress,
  routerForHapi,
  initializeCurrentLocation,

  // React API
  provideRouter,
  RouterProvider,
  Link,
  PersistentQueryLink,
  Fragment,

  // Public action creators
  push,
  replace,
  go,
  goBack,
  goForward,
  block,
  unblock,

  // Public action types
  LOCATION_CHANGED,
  PUSH,
  REPLACE,
  GO,
  GO_FORWARD,
  GO_BACK,
  BLOCK,
  UNBLOCK
};
