import createStoreWithRouter, {
  locationDidChange,
  initializeCurrentLocation
} from './store-enhancer';
import initialStateForSSR from './initial-state-for-ssr';

import provideRouter from './provider';
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

export {
  // High-level Redux API
  createStoreWithRouter,
  initialStateForSSR,
  initializeCurrentLocation,

  // React API
  provideRouter,
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
  createMatcher
};
