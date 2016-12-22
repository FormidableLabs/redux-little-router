import { expect } from 'chai';
import normalizeHref from '../../src/util/normalize-href';

describe('normalizeHref', () => {
  it('appends empty query and search properties', () => {
    const descriptor = { pathname: 'object' };
    expect(normalizeHref(descriptor)).to.deep.equal({
      pathname: 'object',
      search: '',
      query: {}
    });
  });

  it('converts a string href into an object with parsed search and query', () => {
    expect(normalizeHref('/string')).to.deep.equal({
      pathname: '/string'
    });

    expect(normalizeHref('/string?things=stuff')).to.deep.equal({
      pathname: '/string',
      search: '?things=stuff',
      query: {
        things: 'stuff'
      }
    });
  });

  it('ignores empty query objects', () => {
    const result = normalizeHref({
      pathname: '/',
      query: {}
    });

    expect(result).to.have.property('search', '');
  });
});
