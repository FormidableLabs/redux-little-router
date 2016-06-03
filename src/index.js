import createStoreWithRouter from './store-enhancer';
import routerMiddleware, { locationDidChange } from './middleware';
import routerReducer from './reducer';
import Link from './link';
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
  createStoreWithRouter,
  routerMiddleware,
  routerReducer,
  Link,
  createMatcher,
  locationDidChange,
  LOCATION_CHANGED,
  PUSH,
  REPLACE,
  GO,
  GO_FORWARD,
  GO_BACK
};
