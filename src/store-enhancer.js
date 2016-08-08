import {
  LOCATION_CHANGED,
  PUSH, REPLACE, GO,
  GO_BACK, GO_FORWARD
} from './action-types';

import { default as matcherFactory } from './create-matcher';
import routerReducer from './reducer';

export const locationDidChange = ({ location, matchRoute }) => {
  // Extract the pathname so that we don't match against the basename.
  // This avoids requiring basename-hardcoded routes.
  const { pathname } = location;

  return {
    type: LOCATION_CHANGED,
    payload: {
      ...location,
      ...matchRoute(pathname)
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
  return createStore => (reducer, initialState, enhancer) => {
    const enhancedReducer = (state, action) => {
      const vanillaState = {...state};
      delete vanillaState.router;

      const newState = reducer(vanillaState, action);

      // Support redux-loop
      if (Array.isArray(newState)) {
        const [nextState, nextEffects] = newState;
        return [
          {
            ...nextState,
            router: routerReducer(state.router, action)
          },
          nextEffects
        ];
      }

      return {
        ...reducer(vanillaState, action),
        router: routerReducer(state.router, action)
      };
    };

    const store = createStore(enhancedReducer, initialState, enhancer);

    const matchRoute = createMatcher(routes);
    history.listen(location => {
      if (location) {
        store.dispatch(locationDidChange({
          location, matchRoute
        }));
      }
    });

    const dispatch = action => {
      switch (action.type) {
        case PUSH:
          history.push(action.payload);
          break;
        case REPLACE:
          history.replace(action.payload);
          break;
        case GO:
          history.go(action.payload);
          break;
        case GO_BACK:
          history.goBack();
          break;
        case GO_FORWARD:
          history.goForward();
          break;
        default:
          store.dispatch(action);
      }
    };

    return {...store, dispatch, matchRoute};
  };
};
