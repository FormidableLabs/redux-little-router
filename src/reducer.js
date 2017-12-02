// @flow
import type { Location, LocationOptions, LocationAction } from './types';

import {
  LOCATION_CHANGED,
  REPLACE_ROUTES,
  DID_REPLACE_ROUTES,
  isNavigationActionWithPayload
} from './types';

import mergeQueries from './util/merge-queries';
import { get, push, merge, length, shift, omit, toJS } from './util/data';

const flow = (...funcs: Array<*>) =>
  funcs.reduce((prev, curr) => (...args) => curr(prev(...args)));

type ResolverArgs = {
  oldLocation: Location,
  newLocation: Location,
  options: LocationOptions
};

const createResolvers = (get, merge, toJS) => {
  const resolveQuery = ({ oldLocation, newLocation, options }): ResolverArgs => {
    // Merge the old and new queries if asked to persist
    const newLocationQuery = get(newLocation, 'query');

    if (get(options, 'persistQuery')) {
      const mergedQuery = mergeQueries(
        toJS(get(oldLocation, 'query')),
        toJS(newLocationQuery)
      );
      return {
        oldLocation,
        newLocation: merge(newLocation, mergedQuery),
        options
      };
    }

    return {
      oldLocation,
      newLocation: merge(newLocation, { query: newLocationQuery || {} }),
      options
    };
  };

  const resolveBasename = ({ oldLocation, newLocation, options }): ResolverArgs => {
    const basename = get(oldLocation, 'basename');
    if (basename) {
      return {
        oldLocation,
        newLocation: merge({ basename }, newLocation),
        options
      };
    }
    return { oldLocation, newLocation, options };
  };

  const resolvePrevious = ({ oldLocation, newLocation, options }): ResolverArgs => ({
    oldLocation,
    newLocation: merge(newLocation, { previous: oldLocation }),
    options
  });

  return {
    resolveQuery,
    resolveBasename,
    resolvePrevious
  };
};

const createResolveLocation = (get, merge, toJS) => {
  const { resolveQuery, resolveBasename, resolvePrevious } = createResolvers(get, merge, toJS);
  return flow(resolveQuery, resolveBasename, resolvePrevious);
};

const createLocationChangeReducer = ({ get, merge, length, shift, omit, toJS }) => {
  const resolveLocation = createResolveLocation(get, merge, toJS);

  return (state, action) => {
    // No-op the initial route action
    const queue = get(state, 'queue');
    if (
      get(state, 'pathname') === get(action.payload, 'pathname') &&
      get(state, 'search') === get(action.payload, 'search') &&
      get(state, 'hash') === get(action.payload, 'hash') &&
      (!queue || !length(queue))
    ) {
      return state;
    }

    const queuedLocation = (queue && get(queue, 0)) || {};
    const newQueue = (queue && shift(queue)) || [];

    // Extract the previous state, but dump the
    // previous state's previous state so that the
    // state tree doesn't keep growing indefinitely
    // eslint-disable-next-line no-unused-vars
    const oldLocation = omit(state, ['previous', 'routes']);
    const currentRoutes = get(state, 'routes', {});
    const options = get(queuedLocation, 'options', {});
    const query = get(queuedLocation, 'query');

    const { newLocation } = resolveLocation({
      oldLocation,
      newLocation: merge(action.payload, { query }),
      options
    });

    return merge(newLocation, { routes: currentRoutes, queue: newQueue })
  };
};

type ReducerArgs = {|
  routes: Object,
  initialLocation: Location
|};

export const createReducer = ({ get, merge, push, length, shift, omit, toJS }) => {
  const locationChangeReducer = createLocationChangeReducer({ get, merge, length, shift, omit, toJS });

  return ({ routes = {}, initialLocation }: ReducerArgs = {}) =>
    (
      state: Location = merge(initialLocation, { routes, queue: [] }),
      action: LocationAction
    ) => {
      if (isNavigationActionWithPayload(action)) {
        const queue = get(state, 'queue');
        return merge(state, {
          queue: queue && push(queue, action.payload)
        });
      }

      if (action.type === REPLACE_ROUTES) {
        const { routes, options } = action.payload;
        return merge(state, { routes, options });
      }

      if (action.type === DID_REPLACE_ROUTES) {
        return merge(state, { options: {} });
      }

      if (action.type === LOCATION_CHANGED) {
        return locationChangeReducer(state, action);
      }

      return state;
    };
};

export default createReducer({ get, merge, push, length, shift, omit, toJS });
