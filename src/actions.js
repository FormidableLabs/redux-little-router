// @flow
import type { Location, LocationDescriptor } from 'history';

export const LOCATION_CHANGED = 'ROUTER_LOCATION_CHANGED';
export const PUSH = 'ROUTER_PUSH';
export const REPLACE = 'ROUTER_REPLACE';
export const GO = 'ROUTER_GO';
export const GO_BACK = 'ROUTER_GO_BACK';
export const GO_FORWARD = 'ROUTER_GO_FORWARD';

export type BareAction = {
  type: 'ROUTER_GO_BACK' | 'ROUTER_GO_FORWARD'
};

export type IndexedAction = {
  type: 'ROUTER_GO',
  payload: number
};

export type LocationAction = {
  type: 'ROUTER_LOCATION_CHANGED'
};

export type LocationDescriptorAction = {
  type: 'ROUTER_PUSH' | 'ROUTER_REPLACE',
  payload: LocationDescriptor
};

export type RouterAction =
  | BareAction
  | IndexedAction
  | LocationAction
  | LocationDescriptorAction;

export const push = (locationDescriptor: LocationDescriptor) => ({
  type: PUSH,
  payload: locationDescriptor
});

export const replace = (locationDescriptor: LocationDescriptor) => ({
  type: REPLACE,
  payload: locationDescriptor
});

export const go = (index: number) => ({
  type: GO,
  payload: index
});

export const goBack = () => ({ type: GO_BACK });
export const goForward = () => ({ type: GO_FORWARD });

type LocationDidChangeArgs = {
  location: Location,
  matchRoute: Function
};
export const locationDidChange = ({
  location,
  matchRoute
}: LocationDidChangeArgs) => {
  // Extract the pathname so that we don't match against the basename.
  // This avoids requiring basename-hardcoded routes.
  const { pathname } = location;

  return {
    type: LOCATION_CHANGED,
    payload: {
      ...location,
      ...matchRoute(pathname)
    }
  };
};

export const initializeCurrentLocation = (location: Location) => ({
  type: LOCATION_CHANGED,
  payload: location
});
