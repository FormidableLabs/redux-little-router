import { subscribeToStoreAndHistory } from '../enhancer';

export default ({ history, matchRoute, createMatcher }: EnhancerArgs) =>
  (createStore: StoreCreator<*, *>) =>
    (userReducer: Reducer<*, *>, initialState: InitialState, enhancer: StoreEnhancer<*, *>) => {
      const store = createStore(userReducer, initialState, enhancer);
      const { dispatch, subscribe: subscribeToStore } = store;
      const routerState = store.getState().get('router');
      const { listen: subscribeToHistory } = history;

      subscribeToStoreAndHistory({
        routerState,
        dispatch,
        createMatcher,
        matchRoute,
        subscribeToStore,
        subscribeToHistory
      });

      return {
        ...store,
        matchRoute
      };
    };
