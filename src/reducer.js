import { LOCATION_CHANGED } from './action-types';

export default (state = {}, action) => {
  if (action.type === LOCATION_CHANGED) {
    // No-op the initial route action
    if (state && state.url === action.payload.url) {
      return state;
    }

    return {
      ...action.payload,
      previous: state.current
    };
  }
  return state;
};
