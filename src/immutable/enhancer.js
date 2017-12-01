import { executeEnhancer } from '../enhancer';

export default ({ history, matchRoute, createMatcher }: EnhancerArgs) => (
  createStore: StoreCreator<*, *>
) => (
  userReducer: Reducer<*, *>,
  initialState: InitialState,
  enhancer: StoreEnhancer<*, *>
) => {
  const store = createStore(userReducer, initialState, enhancer);
  const { dispatch, getState, subscribe } = store;
  const routerState = getState().get('router');

  executeEnhancer({ history, matchRoute, createMatcher, routerState, dispatch, subscribe });

  return {
    ...store,
    matchRoute
  };
};
