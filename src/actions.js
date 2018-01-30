// @flow
import type { BlockCallback } from 'history';
import type { Location, LocationOptions, Href } from './types';

import {
  PUSH,
  REPLACE,
  GO,
  GO_BACK,
  GO_FORWARD,
  BLOCK,
  UNBLOCK,
  LOCATION_CHANGED,
  REPLACE_ROUTES,
  DID_REPLACE_ROUTES
} from './types';

import normalizeHref from './util/normalize-href';
import flattenRoutes from './util/flatten-routes';

export const push = (href: Href, options: LocationOptions = {}) => ({
  type: PUSH,
  payload: { ...normalizeHref(href), options }
});

export const replace = (href: Href, options: LocationOptions = {}) => ({
  type: REPLACE,
  payload: { ...normalizeHref(href), options }
});

export const go = (index: number) => ({
  type: GO,
  payload: index
});

export const goBack = () => ({ type: GO_BACK });
export const goForward = () => ({ type: GO_FORWARD });

export const block = (historyShouldBlock: BlockCallback) => ({
  type: BLOCK,
  payload: historyShouldBlock
});

export const unblock = () => ({ type: UNBLOCK });

export const locationDidChange = (location: Location) => ({
  type: LOCATION_CHANGED,
  payload: location
});

export const initializeCurrentLocation = (location: Location) => ({
  type: LOCATION_CHANGED,
  payload: location
});

export const replaceRoutes = (routes: Object) => ({
  type: REPLACE_ROUTES,
  payload: {
    routes: flattenRoutes(routes),
    options: {
      updateRoutes: true
    }
  }
});

export const didReplaceRoutes = () => ({
  type: DID_REPLACE_ROUTES
});
