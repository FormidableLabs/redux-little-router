// @flow
import type { Reducer, State, Action } from 'redux';
import routerReducer from './reducer';

export default
  (passRouterStateToReducer: bool) =>
  (vanillaReducer: Reducer) =>
  (state: State, action: Action) => {
    // We have to do this destructuring dance to remove the
    // previous router state from the state we pass to the
    // vanilla reducer. Otherwise, `combineReducers` complains
    // about extraneous keys and ditches the router state.
    //
    // eslint-disable-next-line no-unused-vars
    const { router, ...vanillaState } = state;
    const routerState = routerReducer(state && state.router, action);

    // If we're passing the router state to the vanilla reducer,
    // we don't need any special support for redux-loop
    if (passRouterStateToReducer) {
      const stateWithRouter = {
        ...vanillaState,
        router: routerState
      };
      return vanillaReducer(stateWithRouter, action);
    }

    const newState = vanillaReducer(vanillaState, action);

    // Support redux-loop
    if (Array.isArray(newState)) {
      const nextState = newState[0];
      const nextEffects = newState[1];
      return [
        {
          ...nextState,
          router: routerState
        },
        nextEffects
      ];
    }

    return {
      ...newState,
      router: routerState
    };
  };
