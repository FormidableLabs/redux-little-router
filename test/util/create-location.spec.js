import { expect } from 'chai';
import createLocation from '../../src/util/create-location';

describe('createLocation', () => {
  it('ignores empty query objects', () => {
    const result = createLocation({
      pathname: '/',
      query: {}
    });

    expect(result).to.have.property('search', '');
  });
});
