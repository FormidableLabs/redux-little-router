// @flow

import type { StoreCreator, Reducer, StoreEnhancer } from 'redux';
import type { History, Action, Location as HistoryLocation } from 'history';

import type { Location } from './types';

import qs from 'query-string';

import { POP } from './types';
import { locationDidChange, didReplaceRoutes, replace } from './actions';

import matchCache from './util/match-cache';

type InitialState = {
  router: Location
};

type EnhancerArgs = {|
  history: History,
  matchRoute: Function,
  createMatcher: Function
|};

export const createStoreSubscriber = (
  store: Store<*, *>,
  createMatcher: Function
) => {
  return (currentMatcher: Function) => {
    const {
      routes,
      pathname,
      search,
      hash,
      options: { updateRoutes } = {}
    } = store.getState().router;
    if (updateRoutes) {
      currentMatcher = createMatcher(routes);
      store.dispatch(didReplaceRoutes());
      store.dispatch(replace({ pathname, search, hash }));
    }
    return currentMatcher;
  };
};


export const createHistoryListener = (store: Store<*, *>) => (
  currentMatcher,
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
    store.dispatch({
      type: POP,
      payload
    });
  }
  store.dispatch(locationDidChange(payload));
};


export default ({ history, matchRoute, createMatcher }: EnhancerArgs) => (
  createStore: StoreCreator<*, *>
) => (
  userReducer: Reducer<*, *>,
  initialState: InitialState,
  enhancer: StoreEnhancer<*, *>
) => {
  let currentMatcher = matchRoute;

  const store = createStore(userReducer, initialState, enhancer);
  const storeSubscriber = createStoreSubscriber(store, createMatcher);
  const historyListener = createHistoryListener(store);

  // Replace the matcher when replacing routes
  store.subscribe(() => {
    currentMatcher = storeSubscriber(currentMatcher);
  });

  history.listen((location, action) =>
    historyListener(currentMatcher, location, action)
  );

  return {
    ...store,
    matchRoute
  };
};
