// @flow
import type { Reducer, State, Action } from 'redux';
import routerReducer from './reducer';
export default
  // eslint-disable-next-line max-params
  (passRouterStateToReducer: bool, assign: Function, omit: Function, get: Function) =>
  (vanillaReducer: Reducer) =>
  (state: State, action: Action) => {
    // Here, we use destructuring in place of `_.omit`
    // to remove the `router` key from the vanilla state.
    // We remove this key because passing state to
    // `combineReducers` with keys it doesn't recognize
    // triggers a warning. Worse, `combineReducers` ignores
    // the extraneous key, and therefore stops router state
    // from propagating to the final reduced state.
    //
    // eslint-disable-next-line no-unused-vars
    const vanillaState = omit(state, ['router']);
    const routerState = routerReducer(state && get(state, 'router'), action);

    // If we're passing the router state to the vanilla reducer,
    // we don't need any special support for redux-loop
    if (passRouterStateToReducer) {
      const stateWithRouter = assign(
        vanillaState,
        {
          router: routerState
        }
      );
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

    return assign(
      newState,
      {
        router: routerState
      }
    );
  };
