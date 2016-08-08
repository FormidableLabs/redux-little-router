import { expect } from 'chai';
import sinon from 'sinon';

import createMemoryHistory from 'history/lib/createMemoryHistory';

import initialRouterState from '../src/initial-router-state';

describe('Initial state', () => {
  it('provides the correct routes and query strings for the initial state', () => {
    const history = createMemoryHistory();
    sinon.stub(history, 'createLocation').returns({
      pathname: '/home/messages/b-team',
      search: '?test=ing',
      query: {
        test: 'ing'
      }
    });

    const initialState = initialRouterState({
      history,
      routes: {},
      pathname: '/home/messages/b-team',
      query: {
        test: 'ing'
      }
    });

    expect(initialState).to.have.property('pathname', '/home/messages/b-team');
    expect(initialState).to.have.property('search', '?test=ing');
    expect(initialState).to.have.property('query')
      .that.deep.equals({test: 'ing'});
  });
});
