import { expect } from 'chai';
import mergeQueries from '../../src/util/merge-queries';

describe('mergeQueries', () => {
  it('merges two query objects and adds a merged search string', () => {
    const query1 = {
      cool: 'jeans',
      iced: 'tea'
    };

    const query2 = {
      iced: 'joose'
    };

    expect(mergeQueries(query1, query2)).to.deep.equal({
      query: {
        cool: 'jeans',
        iced: 'joose'
      },
      search: '?cool=jeans&iced=joose'
    });
  });

  it('allows either query to be undefined', () => {
    const query1 = {
      cool: 'jeans',
      iced: 'tea'
    };

    const query2 = void 0;

    expect(mergeQueries(query1, query2)).to.deep.equal({
      query: query1,
      search: '?cool=jeans&iced=tea'
    });

    expect(mergeQueries(query2, query1)).to.deep.equal({
      query: query1,
      search: '?cool=jeans&iced=tea'
    });
  });
});
