import { applyMiddleware } from 'redux';
import { default as matcherFactory } from 'feather-route-matcher';

import routerReducer from './reducer';
import routerMiddleware from './middleware';

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
        router: routerReducer(routes, createMatcher)(
          state.router, action
        )
      };
    };

    return createStore(
      enhancedReducer,
      initialState,
      applyMiddleware(
        routerMiddleware(history),
        ...middleware,
      )
    );
  };
};
