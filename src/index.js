// @flow
import createStoreWithRouter, {
  locationDidChange,
  initializeCurrentLocation
} from './store-enhancer';

import provideRouter, { RouterProvider } from './provider';
import { Link, PersistentQueryLink } from './link';
import Fragment from './fragment';

import routerReducer from './reducer';
import createMatcher from './create-matcher';

import {
  LOCATION_CHANGED,
  PUSH,
  REPLACE,
  GO,
  GO_FORWARD,
  GO_BACK
} from './action-types';

import {
  makeRoute
} from './util';

export {
  // High-level Redux API
  createStoreWithRouter,
  initializeCurrentLocation,

  // React API
  provideRouter,
  RouterProvider,
  Link,
  PersistentQueryLink,
  Fragment,

  // Public action types
  LOCATION_CHANGED,
  PUSH,
  REPLACE,
  GO,
  GO_FORWARD,
  GO_BACK,

  // Low-level Redux utilities
  routerReducer,
  locationDidChange,
  createMatcher,

  // Route utilities
  makeRoute
};
