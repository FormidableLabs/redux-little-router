// @flow
import type { StoreCreator, Reducer, StoreEnhancer } from 'redux';
import type { History, Action, Location as HistoryLocation } from 'history';

import type { Location } from './types';

import qs from 'query-string';

import { POP } from './types';
import { locationDidChange, didReplaceRoutes, replace } from './actions';

import matchCache from './util/match-cache';
import { get } from './util/data';

type InitialState = {
  router: Location
};

type EnhancerArgs = {|
  history: History,
  matchRoute: Function,
  createMatcher: Function
|};

export const createStoreSubscriber = (
  routerState,
  dispatch,
  createMatcher: Function
) => {
  return (currentMatcher: Function) => {
    const {
      routes,
      pathname,
      search,
      hash,
      options: { updateRoutes } = {}
    } = routerState;
    if (updateRoutes) {
      currentMatcher = createMatcher(routes);
      dispatch(didReplaceRoutes());
      dispatch(replace({ pathname, search, hash }));
    }
    return currentMatcher;
  };
};

export const createHistoryListener = (dispatch: Store<*, *>) => (
  currentMatcher: Function,
  location: HistoryLocation,
  action?: Action
) => {
  matchCache.clear();
  const match = currentMatcher(location.pathname);
  const payload = {
    ...location,
    ...match,
    query: qs.parse(location.search)
  };
  // Other actions come from the user, so they already have a
  // corresponding queued navigation action.
  if (action === "POP") {
    dispatch({
      type: POP,
      payload
    });
  }
  dispatch(locationDidChange(payload));
};

export const createEnhancer = (get) =>
  ({ history, matchRoute, createMatcher }: EnhancerArgs) =>
    (createStore: StoreCreator<*, *>) =>
      (userReducer: Reducer<*, *>, initialState: InitialState, enhancer: StoreEnhancer<*, *>) => {
        let currentMatcher = matchRoute;

        const store = createStore(userReducer, initialState, enhancer);
        const routerState = get(store.getState(), 'router');
        const storeSubscriber = createStoreSubscriber(routerState, store.dispatch, createMatcher);
        const historyListener = createHistoryListener(store.dispatch);

        // Replace the matcher when replacing routes
        store.subscribe(() => {
          currentMatcher = storeSubscriber(currentMatcher);
        });

        history.listen((location, action) => historyListener(currentMatcher, location, action));

        return {
          ...store,
          matchRoute
        };
      };

export default createEnhancer(get);
