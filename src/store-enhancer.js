// @flow
import type {
  StoreCreator,
  StoreEnhancer,
  Reducer,
  State
} from 'redux';

import type {
  Pathname,
  Query,
  Location,
  History
} from 'history';

import createBrowserHistory from 'history/lib/createBrowserHistory';
import createMemoryHistory from 'history/lib/createMemoryHistory';
import useBasename from 'history/lib/useBasename';
import useQueries from 'history/lib/useQueries';

import {
  LOCATION_CHANGED,
  PUSH, REPLACE, GO,
  GO_BACK, GO_FORWARD
} from './action-types';

import flattenRoutes from './flatten-routes';
import { default as matcherFactory } from './create-matcher';
import routerReducer from './reducer';
import initialRouterState from './initial-router-state';

const README_MESSAGE = `
  See the README for more information:
  https://github.com/FormidableLabs/redux-little-router#wiring-up-the-boilerplate
`;

type LocationDidChangeArgs = {
  location: Location,
  matchRoute: Function
};
export const locationDidChange = ({
  location,
  matchRoute
}: LocationDidChangeArgs) => {
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

export const initializeCurrentLocation = (location: Location) => ({
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

type StoreEnhancerArgs = {
  routes: Object,
  pathname: Pathname,
  query?: Query,
  basename?: Pathname,
  forServerRender?: bool,
  createMatcher?: Function,
  history?: History
};

export default ({
  routes: nestedRoutes,
  pathname,
  query,
  basename = '',
  forServerRender = false,
  createMatcher = matcherFactory,
  history: userHistory
}: StoreEnhancerArgs) => {
  if (!nestedRoutes) {
    throw Error(`
      Missing route configuration. You must define your routes as
      an object where the keys are routes and the values are any
      route-specific data.

      ${README_MESSAGE}
    `);
  }

  // eslint-disable-next-line no-magic-numbers
  if (
    !Object.keys(nestedRoutes)
      .every(route => route.indexOf('/') === 0)
  ) {
    throw Error(`
      The route configuration you provided is malformed. Make sure
      that all of your routes start with a slash.

      ${README_MESSAGE}
    `);
  }

  const routes = flattenRoutes(nestedRoutes);

  const history = userHistory || resolveHistory({
    basename, forServerRender
  });

  return (createStore: StoreCreator) => (
    reducer: Reducer,
    initialState: State,
    enhancer: StoreEnhancer
  ) => {
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
            router: routerReducer(state && state.router, action)
          },
          nextEffects
        ];
      }

      return {
        ...reducer(vanillaState, action),
        router: routerReducer(state && state.router, action)
      };
    };

    const store = createStore(
      enhancedReducer,
      pathname || query ? {
        ...initialState,
        router: initialRouterState({
          pathname, query: query || {}, routes, history
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

    return {
      ...store,
      dispatch,

      // We attach routes here to allow <RouterProvider>
      // to access unserializable properties of route results.
      routes,

      history,
      matchRoute
    };
  };
};
