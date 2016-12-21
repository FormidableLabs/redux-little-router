import { expect } from 'chai';
import normalizeLocation from '../../src/util/normalize-location';

describe('normalizeLocation', () => {
  it('passes the descriptor through if it is already an object', () => {
    const descriptor = { pathname: 'object' };
    expect(normalizeLocation(descriptor)).to.deep.equal(descriptor);
  });

  it('converts a string descriptor into an object descriptor', () => {
    expect(normalizeLocation('/string')).to.deep.equal({
      pathname: '/string'
    });

    expect(normalizeLocation('/string?things=stuff')).to.deep.equal({
      pathname: '/string',
      search: '?things=stuff'
    });
  });
});
