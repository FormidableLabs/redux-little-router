import { LOCATION_CHANGED } from './action-types';
import { default as matcherFactory } from 'feather-route-matcher';

export default (routes, createMatcher = matcherFactory) => {
  const matchRoute = createMatcher(routes);

  return (state = {}, action) => {
    if (action.type === LOCATION_CHANGED) {
      return {
        ...matchRoute(action.payload.url),
        historyAction: action.payload.action
      };
    }
    return state;
  };
};
