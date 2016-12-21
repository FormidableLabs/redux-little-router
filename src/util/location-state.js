// @flow
import type { Location as HistoryLocation } from 'history';
import type { Location, LocationOptions } from '../types';

export const packState = (
  location: Location,
  options: LocationOptions = {}
): Location => {
  // eslint-disable-next-line no-unused-vars
  const { query, ...rest } = location;
  return {
    ...rest,
    state: {
      ...rest.state || {},

      // Namespace our state to prevent interference
      // with user-provided state
      reduxLittleRouter: {
        query: query || {},
        options
      }
    }
  };
};

export const unpackState = (location: HistoryLocation) => {
  const { state = {}, ...restLocation } = location;
  const { reduxLittleRouter = {}, ...restState } = state;
  const { query = {}, options = {} } = reduxLittleRouter;

  return {
    ...restLocation,
    state: restState,
    query,
    options
  };
};
