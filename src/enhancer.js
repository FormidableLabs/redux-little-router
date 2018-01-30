// @flow
import type {
  StoreCreator,
  Reducer,
  StoreEnhancer,
  Dispatch,
  Store
} from 'redux';
import type { History, Action, Location as HistoryLocation } from 'history';

import type { State } from './types';

import qs from 'query-string';

import { POP } from './types';
import { locationDidChange, didReplaceRoutes, replace } from './actions';

import matchCache from './util/match-cache';

type SubscribeArgs = {
  getState: Function,
  dispatch: Dispatch<*>,
  createMatcher: Function,
  matchRoute: Function,
  subscribeToStore: $PropertyType<Store<*, *>, 'subscribe'>,
  subscribeToHistory: $PropertyType<History, 'listen'>
};

export type EnhancerArgs = {|
  history: History,
  matchRoute: Function,
  createMatcher: Function
|};

export const createStoreSubscriber = (
  getState: Function,
  dispatch: Dispatch<*>,
  createMatcher: Function
) => (currentMatcher: Function) => {
  const { routes, pathname, search, hash, updateRoutes } = getState();

  if (updateRoutes) {
    currentMatcher = createMatcher(routes);
    dispatch(didReplaceRoutes());
    dispatch(replace({ pathname, search, hash }));
  }

  return currentMatcher;
};

export const createHistoryListener = (dispatch: Dispatch<*>) => (
  currentMatcher: Function,
  location: HistoryLocation,
  action?: Action
) => {
  matchCache.clear();

  const match = currentMatcher(location.pathname);
  const payload = {
    ...location,
    ...match,
    query: qs.parse(location.search || '')
  };

  // Other actions come from the user, so they already have a
  // corresponding queued navigation action.
  if (action === 'POP') {
    dispatch({
      type: POP,
      payload
    });
  }

  dispatch(locationDidChange(payload));
};

export const subscribeToStoreAndHistory = ({
  getState,
  dispatch,
  createMatcher,
  matchRoute,
  subscribeToStore,
  subscribeToHistory
}: SubscribeArgs) => {
  const storeSubscriber = createStoreSubscriber(
    getState,
    dispatch,
    createMatcher
  );
  const historyListener = createHistoryListener(dispatch);

  let currentMatcher = matchRoute;

  // Replace the matcher when replacing routes
  subscribeToStore(() => {
    currentMatcher = storeSubscriber(currentMatcher);
  });

  subscribeToHistory((location, action) =>
    historyListener(currentMatcher, location, action)
  );
};

export default ({ history, matchRoute, createMatcher }: EnhancerArgs) => (
  createStore: StoreCreator<*, *>
) => (
  userReducer: Reducer<*, *>,
  initialState: State,
  enhancer: StoreEnhancer<*, *>
) => {
  const store = createStore(userReducer, initialState, enhancer);
  const { dispatch, subscribe: subscribeToStore } = store;
  const { listen: subscribeToHistory } = history;

  const getState = () => {
    const routerState = store.getState().router;
    const { options: { updateRoutes } = {} } = routerState;
    return { ...routerState, updateRoutes };
  };

  subscribeToStoreAndHistory({
    getState,
    dispatch,
    createMatcher,
    matchRoute,
    subscribeToStore,
    subscribeToHistory
  });

  return {
    ...store,
    matchRoute
  };
};
