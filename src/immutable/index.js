import immutableRouterForBrowser from './environment/browser-router';
import immutableRouterForExpress from './environment/express-router';
import immutableRouterForHash from './environment/hash-router';
import immutableRouterForHapi from './environment/hapi-router';

import {
  ImmutableLink,
  ImmutablePersistentQueryLink
} from './components/link';
import ImmutableFragment from './components/fragment';

export {
  // High-level Redux API
  immutableRouterForBrowser,
  immutableRouterForExpress,
  immutableRouterForHapi,
  immutableRouterForHash,
  initializeCurrentLocation,
  // React API
  ImmutableLink,
  ImmutablePersistentQueryLink,
  ImmutableFragment,
};
