// @flow
import {
  LOCATION_CHANGED,
  PUSH,
  REPLACE,
  GO,
  GO_BACK,
  GO_FORWARD,
  POP,
  BLOCK,
  UNBLOCK,
  REPLACE_ROUTES,
  DID_REPLACE_ROUTES
} from './types';

import {
  push,
  replace,
  go,
  goBack,
  goForward,
  block,
  unblock,
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
  block,
  unblock,
  replaceRoutes,
  // Public action types
  LOCATION_CHANGED,
  PUSH,
  REPLACE,
  GO,
  GO_FORWARD,
  GO_BACK,
  POP,
  BLOCK,
  UNBLOCK,
  REPLACE_ROUTES,
  DID_REPLACE_ROUTES
};

export type {
  Query,
  Params,
  LocationOptions,
  Location,
  State,
  Href,
  BareAction,
  IndexedAction,
  LocationAction,
  RouterAction
} from './types';
