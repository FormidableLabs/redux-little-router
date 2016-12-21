// @flow
import type { Location, LocationOptions, LocationAction } from './types';

import { LOCATION_CHANGED } from './types';

const flow = (...funcs: Array<Function>) =>
  funcs.reduce((prev, curr) => (...args) => curr(prev(...args)));

type ResolverArgs = {
  oldLocation: Location,
  newLocation: Location,
  options: LocationOptions
};

const resolveQuery = ({
  oldLocation,
  newLocation,
  options
}: ResolverArgs): ResolverArgs => {
  const { query: oldQuery, search: oldSearch } = oldLocation;

  // Only use the query from state if it exists
  // and the href doesn't provide its own query
  if (
    options.persistQuery &&
    oldQuery &&
    !newLocation.search &&
    !newLocation.query
  ) {
    return {
      oldLocation,
      newLocation: {
        ...newLocation,
        query: oldQuery,
        search: oldSearch
      },
      options
    };
  }

  return { oldLocation, newLocation, options };
};

const resolveBasename = ({
  oldLocation,
  newLocation,
  options
}: ResolverArgs): ResolverArgs => {
  const { basename } = oldLocation;
  if (basename) {
    return {
      oldLocation,
      newLocation: { basename, ...newLocation },
      options
    };
  }
  return { oldLocation, newLocation, options };
};

const resolvePrevious = ({
  oldLocation,
  newLocation,
  options
}: ResolverArgs): ResolverArgs => ({
  oldLocation,
  newLocation: {
    ...newLocation,
    previous: oldLocation
  },
  options
});

export default
  (initialLocation: Location) =>
  (state: Location = initialLocation, action: LocationAction) => {
    if (action.type === LOCATION_CHANGED) {
      // No-op the initial route action
      if (
        state.pathname === action.payload.pathname &&
        state.search === action.payload.search
      ) {
        return state;
      }

      // Extract the previous state, but dump the
      // previous state's previous state so that the
      // state tree doesn't keep growing indefinitely
      // eslint-disable-next-line no-unused-vars
      const { previous, ...oldLocation } = state;
      const { options } = action.payload;

      const resolveLocation = flow(
        resolveQuery,
        resolveBasename,
        resolvePrevious
      );

      return resolveLocation({
        oldLocation,
        newLocation: action.payload,
        options: options || {}
      }).newLocation;
    }
    return state;
  };
