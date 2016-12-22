import { expect } from 'chai';
import stringifyHref from '../../src/util/stringify-href';

describe('stringifyHref', () => {
  it('leaves string hrefs without a basename intact', () => {
    expect(stringifyHref('/boop')).to.equal('/boop');
  });

  it('appends the basename to a string href', () => {
    expect(stringifyHref('/boop', '/base')).to.equal('/base/boop');
  });

  it('creates a string representation of an object href', () => {
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
