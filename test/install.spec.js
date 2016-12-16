import { expect } from 'chai';

import install from '../src/install';

// eslint-disable-next-line max-statements
describe('Router installer', () => {
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
