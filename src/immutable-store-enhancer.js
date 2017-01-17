const immutableStoreEnhancer = (storeEnhancer) => (createStore) =>
  (reducer, initialState, enhancer) => {
    // 3) at this point, only the router initial state could be initialized
    // => we get the immutable initialeState back and set the possible router state
    const fakeCreateStore = (enhancedReducer, routerState, nextEnhancer) => {
      const initialeStateWithRouter = initialState.set('router', routerState.router || {});

      // 5) Action is triggered: we pass a plain object to the enhancedReducer
      // which updates the router state
      const fakeReducer = (state, action) => {
        const enhancedState = enhancedReducer({ router: state.get('router') }, action);
        // 6) reduce all other part of the immutable state
        const immutableReducerState = reducer(state, action);
        // 7) set back the router part in the immutable state
        return immutableReducerState.set('router', enhancedState.router);
      };
      // 4) call next enhancer
      return createStore(fakeReducer, initialeStateWithRouter, nextEnhancer);
    };

    // 1) get the enhanced create store function, passing a fakeCreateStore function
    const enhancedCreateStore = storeEnhancer(fakeCreateStore);
    const noopReducer = state => state;
    // 2) create and returns the enhanced store:
    // passing a plain javascript object as initialState
    // => if query or path were set in the enhancer args,
    // the router part of the state can be properly initialized
    // => fakeCreateStore is called
    return enhancedCreateStore(noopReducer, {}, enhancer);
  };
export default immutableStoreEnhancer;
