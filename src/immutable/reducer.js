// @flow
import { List, Map, fromJS } from 'immutable';

import { resolveLocation } from '../reducer';

const locationChangeReducer = (state, action) => {
  // No-op the initial route action
  const queue = state.get('queue', List());
  if (
    state.get('pathname') === action.payload.pathname &&
    state.get('search') === action.payload.search &&
    state.get('hash') === action.payload.hash &&
    !queue.size
  ) {
    return state;
  }

  const queuedLocation = queue.get(0, Map());
  const newQueue = queue.rest();

  // Extract the previous state, but dump the
  // previous state's previous state so that the
  // state tree doesn't keep growing indefinitely
  // eslint-disable-next-line no-unused-vars
  const oldLocation = state.withMutations(routerState => routerState.delete('previous').delete('routes'));
  const options = queuedLocation.get('options', Map());
  const query = queuedLocation.get('query');

  const { newLocation } = resolveLocation({
    oldLocation: oldLocation.toJS(),
    newLocation: {
      ...action.payload,
      query: query.toJS()
    },
    options: options.toJS()
  });

  return fromJS(newLocation).merge({
    routes: state.get('routes', Map()),
    queue: newQueue
  });
};

export default ({ routes = {}, initialLocation }: ReducerArgs = {}) =>
  (
    state: Location = fromJS({ ...initialLocation, routes, queue: [] })
    action: LocationAction
  ) => {
    if (isNavigationActionWithPayload(action)) {
      const queue = state.withMutations(routerState => {
        const payload = fromJS(action.payload);
        routerState.get('queue', List()).push(payload);
      });
      return state.set('queue', queue);
    }

    if (action.type === REPLACE_ROUTES) {
      const { routes, options } = action.payload;
      return state.withMutations(routerState => {
        routerState.set('routes', fromJS(routes)).set('options', fromJS(options));
      });
    }

    if (action.type === DID_REPLACE_ROUTES) {
      return state.set('options', Map());
    }

    if (action.type === LOCATION_CHANGED) {
      return locationChangeReducer(state, action);
    }

    return state;
  };
