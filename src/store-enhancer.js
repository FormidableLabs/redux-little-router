import exEnv from 'exenv';

import { LOCATION_CHANGED } from './action-types';

import { default as matcherFactory } from './create-matcher';
import routerReducer from './reducer';

export const locationDidChange = ({ location, matchRoute }) => {
  // Build the canonical URL
  const { basename, pathname } = location;
  const trailingSlash = /\/$/;
  const url = `${basename || ''}${pathname}`
    .replace(trailingSlash, '');

  return {
    type: LOCATION_CHANGED,
    payload: {
      ...location,
      ...matchRoute(url),
      url
    }
  };
};

export const initializeCurrentLocation = location => ({
  type: LOCATION_CHANGED,
  payload: location
});

export default ({
  routes,
  history,
  createMatcher = matcherFactory
}) => {
  return createStore => (reducer, initialState) => {
    const enhancedReducer = (state, action) => {
      const vanillaState = {...state};
      delete vanillaState.router;

      const newState = reducer(vanillaState, action);

      // Support redux-loop
      if (Array.isArray(newState)) {
        const [nextState, nextEffects] = newState;
        return [
          {...nextState, router: routerReducer(state.router, action)},
          nextEffects
        ];
      }

      return {
        ...reducer(vanillaState, action),
        router: routerReducer(state.router, action)
      };
    };

    const store = createStore(enhancedReducer, initialState);

    history.listen(location => {
      if (location) {
        store.dispatch(locationDidChange({
          location, matchRoute: createMatcher(routes)
        }));
      }
    });

    if (exEnv.canUseDOM) {
      const state = store.getState();
      const initialLocation = state.router;
      if (initialLocation) {
        store.dispatch(initializeCurrentLocation(initialLocation));
      }
    }

    return store;
  };
};
