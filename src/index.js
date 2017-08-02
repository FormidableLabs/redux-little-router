// @flow
import {
  LOCATION_CHANGED,
  PUSH,
  REPLACE,
  GO,
  GO_BACK,
  GO_FORWARD,
  POP,
  REPLACE_ROUTES,
  DID_REPLACE_ROUTES
} from './types';

import {
  push,
  replace,
  go,
  goBack,
  goForward,
  replaceRoutes,
  initializeCurrentLocation
} from './actions';

import routerForBrowser from './environment/browser-router';
import routerForHash from './environment/hash-router';
import routerForExpress from './environment/express-router';
import routerForHapi from './environment/hapi-router';

import { Link, PersistentQueryLink } from './components/link';
import Fragment from './components/fragment';

export {
  // High-level Redux API
  routerForBrowser,
  routerForExpress,
  routerForHapi,
  routerForHash,
  initializeCurrentLocation,
  // React API
  Link,
  PersistentQueryLink,
  Fragment,
  // Public action creators
  push,
  replace,
  go,
  goBack,
  goForward,
  replaceRoutes,
  // Public action types
  LOCATION_CHANGED,
  PUSH,
  REPLACE,
  GO,
  GO_BACK,
  GO_FORWARD,
  POP,
  REPLACE_ROUTES,
  DID_REPLACE_ROUTES
};
