import { expect } from 'chai';

import install from '../src/install';
import immutableInstall from '../src/immutable/install';

const installTest = {
  install,
  fromState: state => state,
  testLabel: 'router installer'
};
const immutableInstallTest = {
  install: immutableInstall,
  fromState: state => state.toJS(),
  testLabel: 'immutable router installer'
};

[installTest, immutableInstallTest].forEach(({
  install,
  fromState,
  testLabel
}) => {
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
      const { reducer } = install({
        routes: {
          '/:thing': {
            congratulations: 'you played yourself'
          }
        },
        history: {},
        location: { pathname: '/stuff' }
      });
      const state = fromState(reducer(undefined, {}));

      expect(state).to.deep.equal({
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

    it('throws if no routes are provided', () => {
      expect(() => install({
        routes: {},
        history: {},
        location: {}
      })).to.throw(Error);
    });

    it('throws if malformed routes are provided', () => {
      expect(() => install({
        routes: {
          jlshdkfjgh: {},
          '/real-route': {},
          w: 'tf'
        },
        history: {},
        location: {}
      })).to.throw(Error);
    });
  });
});
