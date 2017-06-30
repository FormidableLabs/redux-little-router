import { expect } from 'chai';
import { flow, partialRight } from 'lodash';
import reducer from '../src/reducer';
import { LOCATION_CHANGED, PUSH } from '../src/types';

describe('Router reducer', () => {
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
    const result = reducer()({
      queue: [{
        params: {},
        result: 'rofl',
        pathname: '/rofl',
        state: {
          bork: 'bork'
        }
      }]
    }, action);

    expect(result).to.deep.equal({
      params: {},
      result: 'rofl',
      pathname: '/rofl',
      state: {
        bork: 'bork'
      },
      query: {},
      queue: [],
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
  });

  it('includes the previous location', () => {
    const action = {
      type: LOCATION_CHANGED,
      payload: {
        pathname: '/rofl'
      }
    };
    const result = reducer()({
      pathname: '/waffle',
      queue: [{ pathname: '/rofl' }]
    }, action);

    expect(result).to.deep.equal({
      pathname: '/rofl',
      query: {},
      queue: [],
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

    const result = reducer()({
      basename: '/base',
      queue: [{
        params: {},
        result: 'rofl',
        pathname: '/rofl',
        state: {
          bork: 'bork'
        }
      }]
    }, action);

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
        queue: [{
          params: {},
          result: 'rofl',
          pathname: '/rofl',
          state: {
            bork: 'bork'
          }
        }]
      },
      query: {},
      queue: []
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

    const state = {
      pathname: '/waffle',
      query: {
        please: 'clap'
      },
      search: '?please=clap',
      queue: []
    };

    const result = flow(
      partialRight(reducerInstance, navigationAction),
      partialRight(reducerInstance, listenerAction)
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
      queue: []
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

    const state = {
      pathname: '/waffle',
      query: {
        please: 'clap'
      },
      search: '?please=clap',
      queue: []
    };

    const result = flow(
      partialRight(reducerInstance, navigationAction),
      partialRight(reducerInstance, listenerAction)
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
      queue: []
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
    const result = reducer()({
      pathname: '/rofl',
      other: 'things'
    }, action);

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
    const result = reducer()({}, action);
    expect(result).to.deep.equal({});
  });

  it('does not throw on undefined locations', () => {
    const action = {
      type: 'NOT_MY_ACTION_NOT_MY_PROBLEM',
      payload: {
        crazy: 'nonsense'
      }
    };
    const result = reducer()(undefined, action);
    expect(result).to.deep.equal({ queue: [] });
  });

  it('uses given location as initial state when no initial router state provided', () => {
    const action = {
      type: 'NOT_MY_ACTION_NOT_MY_PROBLEM',
      payload: {
        crazy: 'nonsense'
      }
    };

    const result = reducer({
      pathname: '/lol',
      search: '?as=af',
      query: {
        as: 'af'
      }
    })(undefined, action);

    expect(result).to.deep.equal({
      pathname: '/lol',
      search: '?as=af',
      query: {
        as: 'af'
      },
      queue: []
    });
  });
});
