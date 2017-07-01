// @flow
import type { Location, LocationOptions, LocationAction } from './types';

import qs from 'query-string';

import { LOCATION_CHANGED, isNavigationAction } from './types';

const flow = (...funcs: Array<*>) =>
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
  // Merge the old and new queries if asked to persist
  if (options.persistQuery) {
    const mergedQuery = {
      ...oldLocation.query,
      ...newLocation.query
    };
    return {
      oldLocation,
      newLocation: {
        ...newLocation,
        query: mergedQuery,
        search: `?${qs.stringify(mergedQuery)}`
      },
      options
    };
  }

  return {
    oldLocation,
    newLocation: {
      ...newLocation,
      query: newLocation.query || {}
    },
    options
  };
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

export default (initialLocation: Location) => (
  state: Location = { ...initialLocation, queue: [] },
  action: LocationAction
) => {
  if (isNavigationAction(action)) {
    return {
      ...state,
      queue: state.queue &&
        state.queue.concat([action.payload])
    };
  }

  if (action.type === LOCATION_CHANGED) {
    // No-op the initial route action
    if (
      state.pathname === action.payload.pathname &&
      state.search === action.payload.search &&
      state.hash === action.payload.hash &&
      (!state.queue || !state.queue.length)
    ) {
      return state;
    }

    const queuedLocation = state.queue && state.queue[0] || {};
    const queue = state.queue && state.queue.slice(1) || [];

    // Extract the previous state, but dump the
    // previous state's previous state so that the
    // state tree doesn't keep growing indefinitely
    // eslint-disable-next-line no-unused-vars
    const { previous, ...oldLocation } = state;
    const { options, query } = queuedLocation;

    const resolveLocation = flow(
      resolveQuery,
      resolveBasename,
      resolvePrevious
    );

    const { newLocation } = resolveLocation({
      oldLocation,
      newLocation: {
        ...action.payload,
        query
      },
      options: options || {}
    });

    return { ...newLocation, queue };
  }
  return state;
};
