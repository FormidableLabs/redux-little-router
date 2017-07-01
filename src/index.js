// @flow
import {
  LOCATION_CHANGED,
  PUSH,
  REPLACE,
  GO,
  GO_BACK,
  GO_FORWARD
} from './types';

import {
  push,
  replace,
  go,
  goBack,
  goForward,
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

  // Public action types
  LOCATION_CHANGED,
  PUSH,
  REPLACE,
  GO,
  GO_FORWARD,
  GO_BACK
};
