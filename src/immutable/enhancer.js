// @flow
import type { StoreCreator, Reducer, StoreEnhancer } from 'redux';
import type { Map } from 'immutable';

import type { State } from '../types';
import type { EnhancerArgs } from '../enhancer';

import { subscribeToStoreAndHistory } from '../enhancer';

type ImmutableState = $Shape<State & Map<*, *>>;

export default ({ history, matchRoute, createMatcher }: EnhancerArgs) => (
  createStore: StoreCreator<*, *>
) => (
  userReducer: Reducer<*, *>,
  initialState: ImmutableState,
  enhancer: StoreEnhancer<*, *>
) => {
  const store = createStore(userReducer, initialState, enhancer);
  const { dispatch, subscribe: subscribeToStore } = store;
  const { listen: subscribeToHistory } = history;

  const getState = () => {
    const routerState = store.getState().get('router');
    return {
      routes: routerState.get('routes'),
      pathname: routerState.get('pathname'),
      search: routerState.get('search'),
      hash: routerState.get('hash'),
      updateRoutes: routerState.getIn(['options', 'updateRoutes'])
    };
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
