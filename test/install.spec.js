import { expect } from 'chai';

import install from '../src/install';
import immutableInstall from '../src/immutable/install';

describe('Router installer', () => {
  const setupTest = (installArg) => ({
    router: install(installArg),
    immutableRouter: immutableInstall(installArg)
  });

  const setupAsyncTest = (installArg) => ({
    runInstall: () => install(installArg),
    runImmutableInstall: () => immutableInstall(installArg)
  });

  it('appends the match result to the location passed to the reducer factory', () => {
    const { router, immutableRouter } = setupTest({
      routes: {
        '/:thing': {
          congratulations: 'you played yourself'
        }
      },
      history: {},
      location: { pathname: '/stuff' }
    });
    [router, immutableRouter].forEach(({ reducer }) => {
      const state = reducer(undefined, {});
      expect(state.toJS ? state.toJS() : state).to.deep.equal({
        pathname: '/stuff',
        params: {
          thing: 'stuff'
        },
        route: '/:thing',
        routes: {
          '/:thing': {
            congratulations: 'you played yourself'
          }
        },
        result: {
          congratulations: 'you played yourself'
        },
        queue: []
      });
    });
  });

  it('throws if no routes are provided', () => {
    const { runInstall, runImmutableInstall } = setupAsyncTest({ routes: null, history: {}, location: {} });
    [runInstall, runImmutableInstall].forEach(run => expect(run).to.throw(Error));
  });

  it('throws if malformed routes are provided', () => {
    const { runInstall, runImmutableInstall } = setupAsyncTest({
      routes: {
        jlshdkfjgh: {},
        '/real-route': {},
        w: 'tf'
      },
      history: {},
      location: {}
    });
    [runInstall, runImmutableInstall].forEach(run => expect(run).to.throw(Error));
  });
});
