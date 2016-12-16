// @flow
import routerForBrowser from './environment/browser-router';
import routerForExpress from './environment/express-router';
import routerForHapi from './environment/hapi-router';

import {
  LOCATION_CHANGED,
  PUSH,
  REPLACE,
  GO,
  GO_BACK,
  GO_FORWARD,
  push,
  replace,
  go,
  goBack,
  goForward,
  initializeCurrentLocation
} from './actions';

import provideRouter, { RouterProvider } from './components/provider';
import { Link, PersistentQueryLink } from './components/link';
import { AbsoluteFragment, RelativeFragment } from './components/fragment';

const Fragment = AbsoluteFragment;

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
  AbsoluteFragment,
  RelativeFragment,

  // Public action creators
  push,
  replace,
  go,
  goBack,
  goForward,

  // Public action types
  LOCATION_CHANGED,
  PUSH,
  REPLACE,
  GO,
  GO_FORWARD,
  GO_BACK
};
