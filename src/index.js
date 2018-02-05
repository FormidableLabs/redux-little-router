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

import immutableRouterForBrowser from './immutable';
import immutableRouterForExpress from './immutable';
import immutableRouterForHash from './immutable';
import immutableRouterForHapi from './immutable';

import { Link, PersistentQueryLink } from './components/link';
import Fragment from './components/fragment';

import {
  ImmutableLink,
  ImmutablePersistentQueryLink
} from './immutable';
import ImmutableFragment from './immutable';

export {
  // High-level Redux API
  routerForBrowser,
  routerForExpress,
  routerForHapi,
  routerForHash,
  immutableRouterForBrowser,
  immutableRouterForExpress,
  immutableRouterForHapi,
  immutableRouterForHash,
  initializeCurrentLocation,
  // React API
  Link,
  PersistentQueryLink,
  Fragment,
  ImmutableLink,
  ImmutablePersistentQueryLink,
  ImmutableFragment,
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
