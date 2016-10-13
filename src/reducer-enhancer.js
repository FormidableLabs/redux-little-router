// @flow
import type { Reducer, State, Action } from 'redux';
import routerReducer from './reducer';

export default (vanillaReducer: Reducer) =>
  (state: State, action: Action) => {
    const stateWithRouter = {
      ...state,
      router: routerReducer(state && state.router, action)
    };
    return vanillaReducer(stateWithRouter, action);
  };
