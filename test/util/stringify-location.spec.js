import { expect } from 'chai';
import stringifyLocation from '../../src/util/stringify-location';

describe('stringifyLocation', () => {
  it('creates a string representation of a location', () => {
    expect(stringifyLocation({
      pathname: '/wat'
    })).to.equal('/wat');

    expect(stringifyLocation({
      basename: '/say',
      pathname: '/wat'
    })).to.equal('/say/wat');

    expect(stringifyLocation({
      pathname: '/wat',
      search: '?as=af'
    })).to.equal('/wat?as=af');

    expect(stringifyLocation({
      pathname: '/say/wat',
      search: '?as=af'
    })).to.equal('/say/wat?as=af');
  });
});
