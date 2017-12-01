import {
  push,
  replace,
  go,
  goBack,
  goForward,
  replaceRoutes,
  initializeCurrentLocation
} from '../actions';

import routerForBrowser from './environment/browser-router';
import routerForExpress from './environment/express-router';

import { Link, PersistentQueryLink } from './components/link';
import Fragment from './components/fragment';

export {
  Link,
  PersistentQueryLink,
  Fragment,
  routerForBrowser,
  routerForExpress,
  push,
  replace,
  go,
  goBack,
  goForward,
  replaceRoutes,
  initializeCurrentLocation
};
