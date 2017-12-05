// @flow
import type { StoreCreator, Reducer, StoreEnhancer, Dispatch, Store } from 'redux';
import type { History, Action, Location as HistoryLocation } from 'history';

import type { Location } from './types';

import qs from 'query-string';

import { POP } from './types';
import { locationDidChange, didReplaceRoutes, replace } from './actions';

import matchCache from './util/match-cache';

type InitialState = {
  router: Location
};

type SubscribeArgs = {
  routerState: Location,
  dispatch: Dispatch,
  createMatcher: Function,
  matchRoute: Function,
  subscribeToStore: $PropertyType<Store, 'subscribe'>,
  subscribeToHistory: $PropertyType<History, 'listen'>
};

type EnhancerArgs = {|
  history: History,
  matchRoute: Function,
  createMatcher: Function
|};

export const createStoreSubscriber = (
  routerState: Location,
  dispatch: Dispatch,
  createMatcher: Function
) =>
  (currentMatcher: Function) => {
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

export const createHistoryListener = (dispatch: Dispatch) =>
  (currentMatcher: Function, location: HistoryLocation, action?: Action) => {
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

export const subscribeToStoreAndHistory = ({
  routerState,
  dispatch,
  createMatcher,
  matchRoute,
  subscribeToStore,
  subscribeToHistory
}: SubscribeArgs) => {
  const storeSubscriber = createStoreSubscriber(routerState, dispatch, createMatcher);
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

export default ({ history, matchRoute, createMatcher }: EnhancerArgs) =>
  (createStore: StoreCreator<*, *>) =>
    (userReducer: Reducer<*, *>, initialState: InitialState, enhancer: StoreEnhancer<*, *>) => {
      const store = createStore(userReducer, initialState, enhancer);
      const { dispatch, subscribe: subscribeToStore } = store;
      const { router: routerState } = store.getState();
      const { listen: subscribeToHistory } = history;

      subscribeToStoreAndHistory({
        routerState,
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
