import { expect } from 'chai';
import normalizeDescriptor from '../../src/util/normalize-descriptor';

describe('normalizeDescriptor', () => {
  it('passes the descriptor through if it is already an object', () => {
    const descriptor = { pathname: 'object' };
    expect(normalizeDescriptor(descriptor)).to.deep.equal(descriptor);
  });

  it('converts a string descriptor into an object descriptor', () => {
    expect(normalizeDescriptor('/string')).to.deep.equal({
      pathname: '/string'
    });

    expect(normalizeDescriptor('/string?things=stuff')).to.deep.equal({
      pathname: '/string',
      search: '?things=stuff'
    });
  });
});
