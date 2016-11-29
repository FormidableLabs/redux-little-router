// @flow
import type { Action } from 'redux';
import type { Location } from 'history';
import { LOCATION_CHANGED } from './action-types';

export default (state: ?Location | Object = {}, action: Action) => {
  if (action.type === LOCATION_CHANGED) {
    // No-op the initial route action
    if (
      state &&
      state.pathname === action.payload.pathname &&
      state.search === action.payload.search
    ) {
      return state;
    }

    // Extract the previous state, but dump the
    // previous state's previous state so that the
    // state tree doesn't keep growing indefinitely
    if (state) {
      // eslint-disable-next-line no-unused-vars
      const { previous, ...oldState } = state;

      const nextState = {
        ...action.payload,
        previous: oldState
      };

      // reuse the initial basename if not provided
      return oldState.basename ? {
        basename: oldState.basename,
        ...nextState
      } : nextState;
    }
  }
  return state;
};
