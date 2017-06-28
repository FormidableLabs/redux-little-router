// @flow

import type { StoreCreator, Reducer, StoreEnhancer } from 'redux';
import type { History } from 'history';

import qs from 'query-string';

import { POP } from './types';
import { locationDidChange } from './actions';

import matchCache from './util/match-cache';

type EnhancerArgs = {
  routes: Object,
  history: History,
  matchRoute: Function,
};
export default ({
  routes,
  history,
  matchRoute
}: EnhancerArgs) =>
(createStore: StoreCreator<*, *>) => (
  userReducer: Reducer<*, *>,
  initialState: Location,
  enhancer: StoreEnhancer<*, *>
) => {
  const store = createStore(
    userReducer,
    initialState,
    enhancer
  );

  history.listen((location, action) => {
    matchCache.clear();

    const match = matchRoute(location.pathname);

    // Other actions come from the user, so they already have a
    // corresponding queued navigation action.
    if (action === 'POP') {
      store.dispatch({
        type: POP,
        payload: {
          // We need to parse the query here because there's no user-facing
          // action creator for POP (where we usually parse query strings).
          ...location,
          ...match,
          query: qs.parse(location.search)
        }
      });
    }

    store.dispatch(locationDidChange({
      ...location,
      ...match
    }));
  });

  return {
    ...store,
    routes,
    matchRoute
  };
};
