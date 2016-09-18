// @flow
import type { Reducer, State, Action } from 'redux';
import routerReducer from './reducer';

export default (vanillaReducer: Reducer) =>
  (state: State, action: Action) => {
    const vanillaState = { ...state };
    delete vanillaState.router;

    const newState = vanillaReducer(vanillaState, action);

    // Support redux-loop
    if (Array.isArray(newState)) {
      const nextState = newState[0]; // eslint-disable-line no-magic-numbers
      const nextEffects = newState[1]; // eslint-disable-line no-magic-numbers
      return [
        {
          ...nextState,
          router: routerReducer(state && state.router, action)
        },
        nextEffects
      ];
    }

    return {
      ...newState,
      router: routerReducer(state && state.router, action)
    };
  };
