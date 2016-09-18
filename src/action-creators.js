// @flow
import { LOCATION_CHANGED } from './action-types';
import type { Location } from 'history';

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
