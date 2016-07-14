import bootstrap from './util/bootstrap';
import initialStateForSSR from 'src/initial-state-for-ssr';

const { history, routes } = bootstrap();

describe('Initial state for SSR', () => {
  it('provides the correct routes and query strings for the initial state', () => {
    const initialState = initialStateForSSR({
      history, routes,
      url: '/home/messages/:team',
      query: {
        test: 'ing'
      }
    });

    expect(initialState).to.have.property('pathname', '/home/messages/:team');
    expect(initialState).to.have.property('search', '?test=ing');
    expect(initialState).to.have.property('query')
      .that.deep.equals({test: 'ing'});
  });
});
