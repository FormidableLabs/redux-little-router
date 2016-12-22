import { expect } from 'chai';

import install from '../src/install';

describe('Router installer', () => {
  it('appends the match result to the location passed to the reducer factory', () => {
    const { reducer } = install({
      routes: {
        '/:thing': {
          congratulations: 'you played yourself'
        }
      },
      history: {},
      location: { pathname: '/stuff' }
    });

    expect(reducer(undefined, {})).to.deep.equal({
      pathname: '/stuff',
      params: {
        thing: 'stuff'
      },
      route: '/:thing',
      result: {
        congratulations: 'you played yourself'
      }
    });
  });

  it('throws if no routes are provided', () => {
    expect(() => install({
      routes: null,
      history: {},
      location: {}
    })).to.throw(Error);
  });

  it('throws if malformed routes are provided', () => {
    expect(() => install({
      routes: {
        'jlshdkfjgh': {},
        '/real-route': {},
        'w': 'tf'
      },
      history: {},
      location: {}
    })).to.throw(Error);
  });
});
