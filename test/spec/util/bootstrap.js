import { applyMiddleware, compose, createStore } from 'redux';

import createMemoryHistory from 'history/lib/createMemoryHistory';
import useQueries from 'history/lib/useQueries';

import initialStateForSSR from 'src/initial-state-for-ssr';
import createStoreWithRouter from 'src/store-enhancer';
import routerMiddleware from 'src/middleware';

export default additionalMiddleware => {
  const testMiddleware = assertion => ({ getState }) => next => action => {
    if (assertion) {
      assertion(getState(), action);
    }
    next(action);
  };

  const history = useQueries(createMemoryHistory)();

  const routes = {
    '/home': {
      name: 'home'
    },
    '/home/messages': {
      name: 'messages'
    },
    '/home/messages/:team': {
      name: 'team'
    },
    '/home/messages/:team/:channel': {
      name: 'channel'
    }
  };

  const storeFactory = assertion => {
    const middleware = [
      testMiddleware(assertion),
      routerMiddleware({ history }),
      additionalMiddleware || null
    ].filter(x => x);

    return createStore(
      state => state,
      {
        router: initialStateForSSR({
          history, routes,
          url: '/home/messages/:team',
          query: {
            test: 'ing'
          }
        })
      },
      compose(
        createStoreWithRouter({
          routes, history
        }),
        applyMiddleware(...middleware)
      )
    );
  };

  return { storeFactory, history, routes };
};
