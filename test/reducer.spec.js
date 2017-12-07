import { expect } from 'chai';

import { flow, partialRight } from 'lodash';
import { Map, fromJS } from 'immutable';

import {
  LOCATION_CHANGED,
  PUSH,
  REPLACE_ROUTES,
  DID_REPLACE_ROUTES,
  GO_BACK,
  GO_FORWARD,
  REPLACE
} from '../src/types';
import reducer from '../src/reducer';
import immutableReducer from '../src/immutable/reducer';

describe('Router reducer', () => {
  const createReducers = (initialState) => ({
    reducer: reducer(initialState),
    immutableReducer: immutableReducer(initialState)
  });

  const reduce = ({ reducer, immutableReducer }, state, action) => ({
    result: reducer(state, action),
    immutableResult: immutableReducer(fromJS(state), action)
  });

  const toJS = (obj) => obj.toJS ? obj.toJS() : obj;

  it('adds the pathname to the store', () => {
    const action = {
      type: LOCATION_CHANGED,
      payload: {
        params: {},
        result: 'rofl',
        pathname: '/rofl',
        state: {
          bork: 'bork'
        }
      }
    };
    const state = {
      queue: [{
        params: {},
        result: 'rofl',
        pathname: '/rofl',
        state: {
          bork: 'bork'
        }
      }]
    };

    const reducers = createReducers();
    const { result, immutableResult } = reduce(reducers, state, action);

    [result, immutableResult].forEach(r => {
      expect(toJS(r)).to.deep.equal({
        params: {},
        result: 'rofl',
        pathname: '/rofl',
        state: {
          bork: 'bork'
        },
        query: {},
        queue: [],
        routes: {},
        previous: {
          queue: [{
            params: {},
            result: 'rofl',
            pathname: '/rofl',
            state: {
              bork: 'bork'
            }
          }]
        }
      });
    })
  });

  it('includes the previous location', () => {
    const action = {
      type: LOCATION_CHANGED,
      payload: {
        pathname: '/rofl'
      }
    };
    const state = {
      pathname: '/waffle',
      queue: [{ pathname: '/rofl' }]
    };

    const reducers = createReducers();
    const { result, immutableResult } = reduce(reducers, state, action);

    [result, immutableResult].forEach(r => {
      expect(toJS(r)).to.deep.equal({
        pathname: '/rofl',
        query: {},
        queue: [],
        routes: {},
        previous: {
          pathname: '/waffle',
          queue: [{ pathname: '/rofl' }]
        }
      });
    });
  });

  it('persists the initial basename after subsequent navigations', () => {
    const action = {
      type: LOCATION_CHANGED,
      payload: {
        params: {},
        result: 'rofl',
        pathname: '/rofl',
        state: {
          bork: 'bork'
        }
      }
    };
    const state = {
      basename: '/base',
      queue: [
        {
          params: {},
          result: 'rofl',
          pathname: '/rofl',
          state: {
            bork: 'bork'
          }
        }
      ]
    };

    const reducers = createReducers();
    const { result, immutableResult } = reduce(reducers, state, action);

    [result, immutableResult].forEach(r => {
      expect(toJS(r)).to.deep.equal({
        basename: '/base',
        params: {},
        result: 'rofl',
        pathname: '/rofl',
        state: {
          bork: 'bork'
        },
        previous: {
          basename: '/base',
          queue: [
            {
              params: {},
              result: 'rofl',
              pathname: '/rofl',
              state: {
                bork: 'bork'
              }
            }
          ]
        },
        query: {},
        queue: [],
        routes: {}
      });
    });
  });

  it('persists the previous query if requested', () => {
    const { reducer, immutableReducer } = createReducers();
    const navigationAction = {
      type: PUSH,
      payload: {
        pathname: '/rofl',
        options: {
          persistQuery: true
        }
      }
    };
    const listenerAction = {
      type: LOCATION_CHANGED,
      payload: {
        pathname: '/rofl'
      }
    };
    const state = {
      pathname: '/waffle',
      query: {
        please: 'clap'
      },
      search: '?please=clap',
      queue: []
    };

    [{ reducer, state }, { reducer: immutableReducer, state: fromJS(state) }].forEach(testObj => {
      const { reducer, state } = testObj;
      const result = flow(
        partialRight(reducer, navigationAction),
        partialRight(reducer, listenerAction)
      )(state);

      expect(toJS(result)).to.deep.equal({
        pathname: '/rofl',
        query: {
          please: 'clap'
        },
        search: '?please=clap',
        previous: {
          pathname: '/waffle',
          query: {
            please: 'clap'
          },
          search: '?please=clap',
          queue: [
            {
              options: {
                persistQuery: true
              },
              pathname: '/rofl'
            }
          ]
        },
        queue: [],
        routes: {}
      });
    });
  });

  it('merges old and new queries when requesting persistence', () => {
    const { reducer, immutableReducer } = createReducers();

    const navigationAction = {
      type: PUSH,
      payload: {
        pathname: '/rofl',
        search: '?clap=please',
        query: {
          clap: 'please'
        },
        options: {
          persistQuery: true
        }
      }
    };
    const listenerAction = {
      type: LOCATION_CHANGED,
      payload: {
        pathname: '/rofl',
        search: '?clap=please'
      }
    };
    const state = {
      pathname: '/waffle',
      query: {
        please: 'clap'
      },
      search: '?please=clap',
      queue: []
    };

    [{ reducer, state }, { reducer: immutableReducer, state: fromJS(state) }].forEach(testObj => {
      const { reducer, state } = testObj;
      const result = flow(
        partialRight(reducer, navigationAction),
        partialRight(reducer, listenerAction)
      )(state);

      expect(toJS(result)).to.deep.equal({
        pathname: '/rofl',
        query: {
          clap: 'please',
          please: 'clap'
        },
        search: '?clap=please&please=clap',
        previous: {
          pathname: '/waffle',
          query: {
            please: 'clap'
          },
          search: '?please=clap',
          queue: [
            {
              options: {
                persistQuery: true
              },
              pathname: '/rofl',
              query: {
                clap: 'please'
              },
              search: '?clap=please'
            }
          ]
        },
        queue: [],
        routes: {}
      });
    });
  });

  it('does nothing if the action pathname is the same as the existing', () => {
    const action = {
      type: LOCATION_CHANGED,
      payload: {
        pathname: '/rofl',
        other: 'stuff'
      }
    };
    const state = {
      pathname: '/rofl',
      other: 'things'
    };

    const reducers = createReducers();
    const { result, immutableResult } = reduce(reducers, state, action);

    [result, immutableResult].forEach(r => {
      expect(toJS(r)).to.deep.equal({
        pathname: '/rofl',
        other: 'things'
      });
    });
  });

  it('is not affected by other action types', () => {
    const action = {
      type: 'NOT_MY_ACTION_NOT_MY_PROBLEM',
      payload: {
        crazy: 'nonsense'
      }
    };

    const reducers = createReducers();
    const { result, immutableResult } = reduce(reducers, {}, action);

    [result, immutableResult].forEach(r => {
      expect(toJS(r)).to.deep.equal({});
    });
  });

  it('does not throw on undefined locations', () => {
    const action = {
      type: 'NOT_MY_ACTION_NOT_MY_PROBLEM',
      payload: {
        crazy: 'nonsense'
      }
    };

    const reducers = createReducers();
    const { result, immutableResult } = reduce(reducers, undefined, action);

    [result, immutableResult].forEach(r => {
      expect(toJS(r)).to.deep.equal({ routes: {}, queue: [] });
    });
  });

  it('uses given location as initial state when no initial router state provided', () => {
    const action = {
      type: 'NOT_MY_ACTION_NOT_MY_PROBLEM',
      payload: {
        crazy: 'nonsense'
      }
    };
    const initialState = {
      initialLocation: {
        pathname: '/lol',
        search: '?as=af',
        query: {
          as: 'af'
        }
      }
    };

    const reducers = createReducers(initialState);
    const { result, immutableResult } = reduce(reducers, undefined, action);

    [result, immutableResult].forEach(r => {
      expect(toJS(r)).to.deep.equal({
        pathname: '/lol',
        search: '?as=af',
        query: {
          as: 'af'
        },
        queue: [],
        routes: {}
      });
    });
  });

  it('replaces routes', () => {
    const { reducer, immutableReducer } = createReducers({
      routes: { '/': { pied: 'piper' } },
      pathname: '/bachmanity'
    });
    const replaceRoutesAction = {
      type: REPLACE_ROUTES,
      payload: {
        routes: { '/hoo': 'li' },
        options: { updateRoutes: true }
      }
    };
    const didReplaceRoutesAction = { type: DID_REPLACE_ROUTES };

    [{ reducer, state: {} }, { reducer: immutableReducer, state: Map() }].forEach(testObj => {
      const { reducer, state } = testObj;
      flow(
        partialRight(reducer, replaceRoutesAction),
        state => {
          expect(toJS(state)).to.have.deep.nested.property('routes', { '/hoo': 'li' });
          expect(toJS(state)).to.have.deep.nested.property(
            'options.updateRoutes',
            true
          );
          return state;
        },
        partialRight(reducer, didReplaceRoutesAction),
        state => {
          expect(toJS(state)).to.have.deep.nested.property('routes', { '/hoo': 'li' });
          expect(toJS(state)).to.not.have.deep.nested.property('options.updateRoutes');
          return state;
        }
      )(state);
    });
  });

  it('should only enqueue navigation actions with payloads', () => {
    const { reducer, immutableReducer } = createReducers();

    [reducer, immutableReducer].forEach(r => {
      const result = flow(
        partialRight(r, { type: GO_BACK }),
        partialRight(r, { type: GO_FORWARD }),
        partialRight(r, { type: REPLACE, payload: { pathname: '/lolk' } }),
        partialRight(r, { type: GO_FORWARD }),
        partialRight(r, { type: GO_BACK }),
      )(undefined);

      expect(toJS(result)).to.deep.equal({
        routes: {},
        queue: [{ pathname: '/lolk' }]
      });
    });
  });
});
