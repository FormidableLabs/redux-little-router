// @flow
import type {
  Location,
  LocationOptions,
  Href
} from './types';

import {
  PUSH,
  REPLACE,
  GO,
  GO_BACK,
  GO_FORWARD,
  LOCATION_CHANGED,
  BLOCK,
  UNBLOCK
} from './types';

import normalizeHref from './util/normalize-href';
import { packState } from './util/location-state';

export const push = (href: Href, options: LocationOptions) => ({
  type: PUSH,
  payload: packState(normalizeHref(href), options)
});

export const replace = (href: Href, options: LocationOptions) => ({
  type: REPLACE,
  payload: packState(normalizeHref(href), options)
});

export const go = (index: number) => ({
  type: GO,
  payload: index
});

export const goBack = () => ({ type: GO_BACK });
export const goForward = () => ({ type: GO_FORWARD });

export const locationDidChange = (location: Location) => ({
  type: LOCATION_CHANGED,
  payload: location
});

export const initializeCurrentLocation = (location: Location) => ({
  type: LOCATION_CHANGED,
  payload: location
});

export const block = (callback) => ({ type: BLOCK, callback });
export const unblock = () => ({ type: UNBLOCK });
