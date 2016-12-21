import { expect } from 'chai';
import stringifyHref from '../../src/util/stringify-href';

describe('stringifyHref', () => {
  it('creates a string representation of a location', () => {
    expect(stringifyHref({
      pathname: '/wat'
    })).to.equal('/wat');

    expect(stringifyHref({
      pathname: '/wat'
    }, '/say')).to.equal('/say/wat');

    expect(stringifyHref({
      pathname: '/wat',
      search: '?as=af'
    })).to.equal('/wat?as=af');

    expect(stringifyHref({
      pathname: '/say/wat',
      search: '?as=af'
    })).to.equal('/say/wat?as=af');
  });
});
