// @flow
import type { Action } from 'redux';
import type { Location } from 'history';
import { LOCATION_CHANGED } from './action-types';

export default (state: ?Location | Object = {}, action: Action) => {
  if (action.type === LOCATION_CHANGED) {
    // No-op the initial route action
    if (state && state.pathname === action.payload.pathname) {
      return state;
    }

    return {
      ...action.payload,
      previous: state && state.current
    };
  }
  return state;
};
