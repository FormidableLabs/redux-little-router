import createBrowserHistory from 'history/lib/createBrowserHistory';
import createMemoryHistory from 'history/lib/createMemoryHistory';
import useBasename from 'history/lib/useBasename';
import useQueries from 'history/lib/useQueries';

import {
  LOCATION_CHANGED,
  PUSH, REPLACE, GO,
  GO_BACK, GO_FORWARD
} from './action-types';

import { default as matcherFactory } from './create-matcher';
import routerReducer from './reducer';
import initialRouterState from './initial-router-state';

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

const resolveHistory = ({
  basename,
  forServerRender
}) => {
  const historyFactory = forServerRender
    ? createMemoryHistory
    : createBrowserHistory;

  return useBasename(useQueries(historyFactory))({
    basename
  });
};

export default ({
  routes,
  pathname,
  query,
  basename = '',
  forServerRender = false,
  createMatcher = matcherFactory,
  history: userHistory
}) => {
  const history = userHistory || resolveHistory({
    basename, forServerRender
  });

  return createStore => (reducer, initialState, enhancer) => {
    const enhancedReducer = (state, action) => {
      const vanillaState = {...state};
      delete vanillaState.router;

      const newState = reducer(vanillaState, action);

      // Support redux-loop
      if (Array.isArray(newState)) {
        const nextState = newState[0]; // eslint-disable-line no-magic-numbers
        const nextEffects = newState[1]; // eslint-disable-line no-magic-numbers
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

    const store = createStore(
      enhancedReducer,
      pathname || query ? {
        ...initialState,
        router: initialRouterState({
          pathname, query, routes, history
        }
      )} : initialState,
      enhancer
    );

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
          return null;
        case REPLACE:
          history.replace(action.payload);
          return null;
        case GO:
          history.go(action.payload);
          return null;
        case GO_BACK:
          history.goBack();
          return null;
        case GO_FORWARD:
          history.goForward();
          return null;
        default:
          // We return the result of dispatch here
          // to retain compatibility with enhancers
          // that return a promise from dispatch.
          return store.dispatch(action);
      }
    };

    return {...store, dispatch, history, matchRoute};
  };
};
