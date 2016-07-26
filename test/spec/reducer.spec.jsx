import { routerReducer } from 'src';
import { LOCATION_CHANGED } from 'src/action-types';

describe('Router reducer', () => {
  it('adds the pathname to the store', () => {
    const action = {
      type: LOCATION_CHANGED,
      payload: {
        params: {},
        result: 'rofl',
        url: '/rofl',
        pathname: '/rofl',
        action: 'PUSH',
        state: {
          bork: 'bork'
        }
      }
    };
    const result = routerReducer({}, action);

    expect(result).to.deep.equal({
      params: {},
      result: 'rofl',
      url: '/rofl',
      pathname: '/rofl',
      action: 'PUSH',
      state: {
        bork: 'bork'
      },
      previous: undefined
    });
  });

  it('is not affected by other action types', () => {
    const action = {
      type: 'NOT_MY_ACTION_NOT_MY_PROBLEM',
      payload: {
        crazy: 'nonsense'
      }
    };
    const result = routerReducer({}, action);
    expect(result).to.deep.equal({});
  });
});
