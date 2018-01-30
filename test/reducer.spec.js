/* eslint-disable new-cap, max-nested-callbacks */
import { expect } from 'chai';

import { flow, partialRight } from 'lodash';
import { fromJS } from 'immutable';

import {
  LOCATION_CHANGED,
  PUSH,
  REPLACE_ROUTES,
  DID_REPLACE_ROUTES,
  GO_BACK,
  GO_FORWARD,
  REPLACE
} from '../src/types';
import routerReducer from '../src/reducer';
import immutableReducer from '../src/immutable/reducer';

const reducerTest = {
  reducer: routerReducer,
  toState: state => state,
  readState: state => state,
  testLabel: 'router reducer'
};
const immutableReducerTest = {
  reducer: immutableReducer,
  toState: state => fromJS(state),
  readState: state => state.toJS(),
  testLabel: 'immutable router reducer'
};

[reducerTest, immutableReducerTest].forEach(
  ({ reducer, toState, readState, testLabel }) => {
    describe(`${testLabel}`, () => {
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
        const state = toState({
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
        });
        const result = readState(reducer()(state, action));

        expect(result).to.deep.equal({
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
          }
        });
      });

      it('includes the previous location', () => {
        const action = {
          type: LOCATION_CHANGED,
          payload: {
            pathname: '/rofl'
          }
        };
        const state = toState({
          pathname: '/waffle',
          queue: [{ pathname: '/rofl' }]
        });
        const result = readState(reducer()(state, action));

        expect(result).to.deep.equal({
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
        const state = toState({
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
        });

        const result = readState(reducer()(state, action));

        expect(result).to.deep.equal({
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

      it('persists the previous query if requested', () => {
        const reducerInstance = reducer();

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

        const state = toState({
          pathname: '/waffle',
          query: {
            please: 'clap'
          },
          search: '?please=clap',
          queue: []
        });

        const result = flow(
          partialRight(reducerInstance, navigationAction),
          partialRight(reducerInstance, listenerAction),
          readState
        )(state);

        expect(result).to.deep.equal({
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

      it('merges old and new queries when requesting persistence', () => {
        const reducerInstance = reducer();

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

        const state = toState({
          pathname: '/waffle',
          query: {
            please: 'clap'
          },
          search: '?please=clap',
          queue: []
        });

        const result = flow(
          partialRight(reducerInstance, navigationAction),
          partialRight(reducerInstance, listenerAction),
          readState
        )(state);

        expect(result).to.deep.equal({
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

      it('does nothing if the action pathname is the same as the existing', () => {
        const action = {
          type: LOCATION_CHANGED,
          payload: {
            pathname: '/rofl',
            other: 'stuff'
          }
        };
        const state = toState({
          pathname: '/rofl',
          other: 'things'
        });
        const result = readState(reducer()(state, action));

        expect(result).to.deep.equal({
          pathname: '/rofl',
          other: 'things'
        });
      });

      it('is not affected by other action types', () => {
        const action = {
          type: 'NOT_MY_ACTION_NOT_MY_PROBLEM',
          payload: {
            crazy: 'nonsense'
          }
        };
        const state = toState({});
        const result = readState(reducer()(state, action));
        expect(result).to.deep.equal({});
      });

      it('does not throw on undefined locations', () => {
        const action = {
          type: 'NOT_MY_ACTION_NOT_MY_PROBLEM',
          payload: {
            crazy: 'nonsense'
          }
        };
        const result = readState(reducer()(undefined, action));
        expect(result).to.deep.equal({ routes: {}, queue: [] });
      });

      it('uses given location as initial state when no initial router state provided', () => {
        const action = {
          type: 'NOT_MY_ACTION_NOT_MY_PROBLEM',
          payload: {
            crazy: 'nonsense'
          }
        };
        // `initialState` is always fed in as pure js, even in the immutable case
        const initialState = {
          initialLocation: {
            pathname: '/lol',
            search: '?as=af',
            query: {
              as: 'af'
            }
          }
        };
        const result = readState(reducer(initialState)(undefined, action));

        expect(result).to.deep.equal({
          pathname: '/lol',
          search: '?as=af',
          query: {
            as: 'af'
          },
          queue: [],
          routes: {}
        });
      });

      it('replaces routes', () => {
        const initialState = toState({
          routes: {
            '/': {
              pied: 'piper'
            }
          },
          pathname: '/bachmanity'
        });
        const reducerInstance = reducer(initialState);

        const replaceRoutesAction = {
          type: REPLACE_ROUTES,
          payload: {
            routes: { '/hoo': 'li' },
            options: { updateRoutes: true }
          }
        };

        const didReplaceRoutesAction = { type: DID_REPLACE_ROUTES };

        flow(
          partialRight(reducerInstance, replaceRoutesAction),
          state => {
            const result = readState(state);
            expect(result).to.have.deep.nested.property('routes', {
              '/hoo': 'li'
            });
            expect(result).to.have.deep.nested.property(
              'options.updateRoutes',
              true
            );
            return state;
          },
          partialRight(reducerInstance, didReplaceRoutesAction),
          state => {
            const result = readState(state);
            expect(result).to.have.deep.nested.property('routes', {
              '/hoo': 'li'
            });
            expect(result).to.not.have.deep.nested.property(
              'options.updateRoutes'
            );
            return state;
          }
        )(toState({}));
      });

      it('should only enqueue navigation actions with payloads', () => {
        const reducerInstance = reducer();
        const result = flow(
          partialRight(reducerInstance, { type: GO_BACK }),
          partialRight(reducerInstance, { type: GO_FORWARD }),
          partialRight(reducerInstance, {
            type: REPLACE,
            payload: { pathname: '/lolk' }
          }),
          partialRight(reducerInstance, { type: GO_FORWARD }),
          partialRight(reducerInstance, { type: GO_BACK }),
          readState
        )(undefined);

        expect(result).to.deep.equal({
          routes: {},
          queue: [
            {
              pathname: '/lolk'
            }
          ]
        });
      });
    });
  }
);
