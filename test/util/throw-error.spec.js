import { expect } from 'chai';
import throwError from '../../src/util/throw-error';

describe('throwError', () => {
  it('throws an error', () => {
    expect(throwError()).to.throw();
  });

  it('throws an error with an error message', () => {
    const throwWeirdError = throwError('There was a weird error.');
    expect(throwWeirdError).to.throw('There was a weird error.');
  });

  it('lists the arguments passed in', () => {
    expect(throwError().bind(null, 1, 'two')).to.throw(
      'Was called with arguments 1, two.'
    );
  });
});
