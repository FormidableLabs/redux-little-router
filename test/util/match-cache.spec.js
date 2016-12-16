import { expect } from 'chai';
import { MatchCache } from '../../src/util/match-cache';

let cache;

describe('MatchCache', () => {
  beforeEach(() => {
    cache = new MatchCache();
  });

  it('allows items to be set', () => {
    cache.add('foo', 'bar');
    expect(cache._data).to.deep.equal({ foo: 'bar' });
  });

  it('allows items to be retrieved', () => {
    cache.add('foo', 'bar');
    const foo = cache.get('foo');
    expect(foo).to.equal('bar');
  });

  it('is clearable', () => {
    cache.add('foo', 'bar');
    cache.clear();
    expect(cache._data).to.deep.equal({});
  });
});
