import { expect } from 'chai';
import enhanceLocation from '../../src/util/enhance-location';

describe('enhanceLocation', () => {
  it('ignores empty query objects', () => {
    const result = enhanceLocation({
      pathname: '/',
      query: {}
    });

    expect(result).to.have.property('search', '');
  });
});
