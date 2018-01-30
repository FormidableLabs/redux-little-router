// @flow
import type { Location, LocationOptions, LocationAction } from './types';

import {
  LOCATION_CHANGED,
  REPLACE_ROUTES,
  DID_REPLACE_ROUTES,
  isNavigationActionWithPayload
} from './types';

import mergeQueries from './util/merge-queries';

type ResolverArgs = {
  oldLocation: Location,
  newLocation: Location,
  options: LocationOptions
};

export type ReducerArgs = {|
  routes: Object,
  initialLocation: Location
|};

const flow = (...funcs: Array<*>) =>
  funcs.reduce((prev, curr) => (...args: Array<*>) => curr(prev(...args)));

const resolveQuery = ({
  oldLocation,
  newLocation,
  options
}: ResolverArgs): ResolverArgs => {
  // Merge the old and new queries if asked to persist
  if (options.persistQuery) {
    const mergedQuery = mergeQueries(oldLocation.query, newLocation.query);
    return {
      oldLocation,
      newLocation: {
        ...newLocation,
        ...mergedQuery
      },
      options
    };
  }

  return {
    oldLocation,
    newLocation: {
      ...newLocation,
      query: newLocation.query
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

export const resolveLocation = flow(
  resolveQuery,
  resolveBasename,
  resolvePrevious
);

const locationChangeReducer = (state, action) => {
  // No-op the initial route action
  const { queue = [] } = state;
  if (
    state.pathname === action.payload.pathname &&
    state.search === action.payload.search &&
    state.hash === action.payload.hash &&
    !queue.length
  ) {
    return state;
  }

  const queuedLocation = queue[0] || {};
  const newQueue = queue.slice(1);

  // Extract the previous state, but dump the
  // previous state's previous state so that the
  // state tree doesn't keep growing indefinitely
  // eslint-disable-next-line no-unused-vars
  const { previous, routes: currentRoutes = {}, ...oldLocation } = state;
  const { options = {}, query = {} } = queuedLocation;
  const newLocation = { ...action.payload, query };

  const { newLocation: resolvedNewLocation } = resolveLocation({
    oldLocation,
    newLocation,
    options
  });

  return { ...resolvedNewLocation, routes: currentRoutes, queue: newQueue };
};

export default ({ routes = {}, initialLocation }: ReducerArgs = {}) => (
  state: Location = { ...initialLocation, routes, queue: [] },
  action: LocationAction
) => {
  if (isNavigationActionWithPayload(action)) {
    return {
      ...state,
      queue: state.queue && state.queue.concat([action.payload])
    };
  }

  if (action.type === REPLACE_ROUTES) {
    return {
      ...state,
      routes: action.payload.routes,
      options: action.payload.options
    };
  }

  if (action.type === DID_REPLACE_ROUTES) {
    return { ...state, options: {} };
  }

  if (action.type === LOCATION_CHANGED) {
    return locationChangeReducer(state, action);
  }

  return state;
};
