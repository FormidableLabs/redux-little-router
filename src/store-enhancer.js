import { applyMiddleware } from 'redux';
import { default as matcherFactory } from './create-matcher';

import routerReducer from './reducer';
import routerMiddleware, { initializeCurrentLocation } from './middleware';

export default ({
  middleware,
  routes,
  history,
  createMatcher = matcherFactory
}) => {
  return createStore => (reducer, initialState) => {
    const enhancedReducer = (state, action) => {
      const vanillaState = {...state};
      delete vanillaState.router;

      return {
        ...reducer(vanillaState, action),
        router: routerReducer(state.router, action)
      };
    };

    const store = createStore(
      enhancedReducer,
      initialState,
      applyMiddleware(
        routerMiddleware({
          history, matchRoute: createMatcher(routes)
        }),
        ...middleware,
      )
    );

    const state = store.getState();
    const initialLocation = state.router && state.router.current;
    if (initialLocation) {
      store.dispatch(initializeCurrentLocation(initialLocation));
    }

    return store;
  };
};
