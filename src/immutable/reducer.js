// @flow
import { List, Map, fromJS } from 'immutable';

import type { Location, LocationOptions, LocationAction } from '../types';

import {
  LOCATION_CHANGED,
  REPLACE_ROUTES,
  DID_REPLACE_ROUTES,
  isNavigationActionWithPayload
} from '../types';

import { resolveLocation } from "../reducer";

const locationChangeReducer = (state, action) => {
  const queue = state.get('queue');
  // No-op the initial route action
  if (
    state.get('pathname') === action.payload.pathname &&
    state.get('search') === action.payload.search &&
    state.get('hash') === action.payload.hash &&
    (!queue || !queue.length)
  ) {
    return state;
  }

  const queuedLocation = (queue && queue.get(0)) || Map();
  const newQueue = (queue && queue.rest()) || List();

  // Extract the previous state, but dump the
  // previous state's previous state so that the
  // state tree doesn't keep growing indefinitely
  // eslint-disable-next-line no-unused-vars
  // const { previous, routes: currentRoutes = {}, ...oldLocation } = state;
  const oldLocation = state.withMutations(state => {
    state.delete('previous').delete('routes');
  }).toJS();
  const options = queuedLocation.get('options', Map()).toJS();
  const query = queuedLocation.get('query', Map()).toJS();

  const { newLocation } = resolveLocation({
    oldLocation,
    newLocation: {
      ...action.payload,
      query
    },
    options
  });

  return fromJS(newLocation).merge(Map({ routes: state.get('routes'), queue: newQueue }));
};

type ReducerArgs = {|
  routes: Object,
  initialLocation: Location
|};

const initialState = ({ routes, initialLocation }) =>
  Map({ routes: fromJS(routes), queue: List() }).merge(fromJS(initialLocation));

export default ({ routes = {}, initialLocation }: ReducerArgs = {}) => (
  state: Location = initialState({ routes, initialLocation }),
  action: LocationAction
) => {
  if (isNavigationActionWithPayload(action)) {
    return state.update('queue', queue => queue && queue.push(fromJS(action.payload)));
  }

  if (action.type === REPLACE_ROUTES) {
    return state.withMutations(state => {
      state.set('routes', fromJS(action.payload.routes))
        .set('options', fromJS(action.payload.options));
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
