// @flow
import type { Location as HistoryLocation } from 'history';
import type { Location, LocationOptions } from '../types';

export const packState = (
  location: Location,
  options: LocationOptions = {}
): Location => ({
  ...location,
  state: {
    ...location.state || {},

    // Namespace our state to prevent interference
    // with user-provided state
    reduxLittleRouter: {
      query: location.query || {},
      options
    }
  }
});

export const unpackState = (location: HistoryLocation) => {
  const { state } = location;
  const libraryState = state && state.reduxLittleRouter;
  const query = libraryState && libraryState.query || {};
  const options = libraryState && libraryState.options || {};

  return { ...location, query, options };
};
