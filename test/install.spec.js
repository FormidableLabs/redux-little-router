/* eslint-disable max-nested-callbacks */
import { expect } from 'chai';

import installRouter from '../src/install';
import immutableInstall from '../src/immutable/install';

const installTest = {
  install: installRouter,
  readState: state => state,
  testLabel: 'router installer'
};
const immutableInstallTest = {
  install: immutableInstall,
  readState: state => state.toJS(),
  testLabel: 'immutable router installer'
};

[installTest, immutableInstallTest].forEach(
  ({ install, readState, testLabel }) => {
    describe(`${testLabel}`, () => {
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
        const state = readState(reducer(undefined, {}));

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
        expect(() =>
          install({
            routes: {},
            history: {},
            location: {}
          })
        ).to.throw(Error);
      });

      it('throws if malformed routes are provided', () => {
        expect(() =>
          install({
            routes: {
              jlshdkfjgh: {},
              '/real-route': {},
              w: 'tf'
            },
            history: {},
            location: {}
          })
        ).to.throw(Error);
      });
    });
  }
);
