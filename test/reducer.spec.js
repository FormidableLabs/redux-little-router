import { expect } from 'chai';
import reducer from '../src/reducer';
import { LOCATION_CHANGED } from '../src/types';

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
    const result = reducer()({}, action);

    expect(result).to.deep.equal({
      params: {},
      result: 'rofl',
      pathname: '/rofl',
      state: {
        bork: 'bork'
      },
      previous: {}
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
      pathname: '/waffle'
    }, action);

    expect(result).to.deep.equal({
      pathname: '/rofl',
      previous: {
        pathname: '/waffle'
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
      basename: '/base'
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
        basename: '/base'
      }
    });
  });

  it('persists the previous query string if requested', () => {
    const action = {
      type: LOCATION_CHANGED,
      payload: {
        pathname: '/rofl',
        options: {
          persistQuery: true
        }
      }
    };

    const result = reducer()({
      pathname: '/waffle',
      query: {
        please: 'clap'
      },
      search: '?please=clap'
    }, action);

    expect(result).to.deep.equal({
      pathname: '/rofl',
      query: {
        please: 'clap'
      },
      search: '?please=clap',
      options: {
        persistQuery: true
      },
      previous: {
        pathname: '/waffle',
        query: {
          please: 'clap'
        },
        search: '?please=clap'
      }
    });
  });

  it('allows new queries to override persistQuery', () => {
    const action = {
      type: LOCATION_CHANGED,
      payload: {
        pathname: '/rofl',
        query: {
          clap: 'please'
        },
        search: '?clap=please',
        options: {
          persistQuery: true
        }
      }
    };

    const result = reducer()({
      pathname: '/waffle',
      query: {
        please: 'clap'
      },
      search: '?please=clap'
    }, action);

    expect(result).to.deep.equal({
      pathname: '/rofl',
      query: {
        clap: 'please'
      },
      search: '?clap=please',
      options: {
        persistQuery: true
      },
      previous: {
        pathname: '/waffle',
        query: {
          please: 'clap'
        },
        search: '?please=clap'
      }
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
    expect(result).to.be.undefined;
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
      }
    });
  });
});
