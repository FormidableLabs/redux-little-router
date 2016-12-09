import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';

import { createStore } from 'redux';

import jsdom from 'jsdom';

import routerForBrowser from '../src/browser-router';

import routes from './fixtures/routes';

chai.use(sinonChai);

/*global window*/

describe('Browser router', () => {
  it('creates a browser store enhancer using window.location', () => {
    jsdom.changeURL(window, 'https://example.com/home?get=schwifty');
    const { routerEnhancer } = routerForBrowser({
      routes
    });
    const store = createStore(
      state => state,
      {},
      routerEnhancer
    );
    const state = store.getState();
    expect(state).to.have.deep.property('router.pathname', '/home');
    expect(state).to.have.deep.property('router.search', '?get=schwifty');
    expect(state).to.have.deep.property('router.query')
      .that.deep.equals({ get: 'schwifty' });
  });

  it('supports basenames', () => {
    jsdom.changeURL(window, 'https://example.com/cob-planet/home?get=schwifty');

    const { routerEnhancer } = routerForBrowser({
      routes,
      basename: '/cob-planet'
    });
    const store = createStore(
      state => state,
      {},
      routerEnhancer
    );
    const state = store.getState();
    expect(state).to.have.deep.property('router.basename', '/cob-planet');
    expect(state).to.have.deep.property('router.pathname', '/home');
    expect(state).to.have.deep.property('router.search', '?get=schwifty');
    expect(state).to.have.deep.property('router.query')
      .that.deep.equals({ get: 'schwifty' });
  });
});
