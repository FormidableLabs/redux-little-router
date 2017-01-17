// @flow
import routerForBrowser from './browser-router';
import routerForExpress from './express-router';
import routerForHapi from './hapi-router';
import createStoreWithRouter from './store-enhancer';
import routerMiddleware from './middleware';
import { locationDidChange, initializeCurrentLocation } from './action-creators';

import provideRouter, { RouterProvider } from './provider';
import { Link, PersistentQueryLink } from './link';
import { AbsoluteFragment, RelativeFragment } from './fragment';
import PlaceholderFragment from './placeholder-fragment';

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

const Fragment = AbsoluteFragment;

export {
  // High-level Redux API
  routerForBrowser,
  routerForExpress,
  routerForHapi,
  routerMiddleware,
  initializeCurrentLocation,

  // React API
  provideRouter,
  RouterProvider,
  Link,
  PersistentQueryLink,
  Fragment,
  AbsoluteFragment,
  RelativeFragment,
  PlaceholderFragment,

  // Public action types
  LOCATION_CHANGED,
  PUSH,
  REPLACE,
  GO,
  GO_FORWARD,
  GO_BACK,

  // Low-level Redux utilities
  routerReducer,
  createStoreWithRouter,
  locationDidChange,
  createMatcher
};
