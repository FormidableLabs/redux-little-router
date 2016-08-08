/* eslint-disable max-nested-callbacks */
import { expect } from 'chai';
import sinon from 'sinon';

import React from 'react';
import { shallow, mount } from 'enzyme';

import { PUSH, REPLACE } from '../src/action-types';
import { Link, PersistentQueryLink } from '../src/link';

import {
  captureErrors,
  fakeContext,
  standardClickEvent
} from './util';

describe('Router link component', () => {
  describe('Vanilla link', () => {
    describe('PUSH', () => {
      const hrefs = [
        '/home/messages/a-team?test=ing',
        {
          pathname: '/home/messages/a-team?test=ing',
          query: {
            test: 'ing'
          }
        }
      ];

      const fakeNewLocation = {
        pathname: '/home/messages/a-team',
        search: '?test=ing',
        action: 'PUSH',
        query: { test: 'ing' }
      };

      hrefs.forEach(href =>
        it('dispatches a PUSH action with the correct href when clicked', done => {
          const assertion = action => {
            if (action.type === PUSH) {
              const { payload } = action;
              captureErrors(done, () => {
                expect(payload).to.have.property('action', 'PUSH');
                expect(payload).to.have.property('pathname')
                  .that.contains('/home/messages/a-team');
                expect(payload).to.have.property('query')
                  .that.deep.equals({ test: 'ing' });
              });
            }
          };

          const wrapper = shallow(
            <Link href={href} />,
            fakeContext({ fakeNewLocation, assertion })
          );

          wrapper.find('a').simulate('click', standardClickEvent);
        })
      );
    });

    describe('REPLACE', () => {
      const hrefs = [
        '/home/messages/a-team?test=ing',
        {
          pathname: '/home/messages/a-team?test=ing',
          query: {
            test: 'ing'
          }
        }
      ];

      const fakeNewLocation = {
        pathname: '/home/messages/a-team',
        search: '?test=ing',
        action: 'REPLACE',
        query: { test: 'ing' }
      };

      hrefs.forEach(href => {
        it('dispatches a REPLACE action with the correct href when clicked', done => {
          const assertion = action => {
            if (action.type === REPLACE) {
              const { payload } = action;
              captureErrors(done, () => {
                expect(payload).to.have.property('action', 'REPLACE');
                expect(payload).to.have.property('pathname')
                  .that.contains('/home/messages/a-team');
                expect(payload).to.have.property('query')
                  .that.deep.equals({ test: 'ing' });
              });
            }
          };

          const wrapper = shallow(
            <Link replaceState href={href} />,
            fakeContext({ fakeNewLocation, assertion })
          );

          wrapper.find('a').simulate('click', standardClickEvent);
        });
      });
    });

    describe('Accessibility', () => {
      ['shiftKey', 'altKey', 'metaKey', 'ctrlKey'].forEach(modifierKey =>
        it(`uses default browser behavior when the user holds the ${modifierKey}`, () => {
          const fakeNewLocation = {
            pathname: '/home/things',
            search: '',
            action: 'PUSH',
            query: {}
          };

          const wrapper = shallow(
            <Link href='/home/things' />,
            fakeContext({ fakeNewLocation })
          );

          const spy = sinon.spy();
          wrapper.find('a').simulate('click', {
            ...standardClickEvent,
            [modifierKey]: true,
            preventDefault: spy
          });

          expect(spy).to.not.have.been.called;
        })
      );

      it('uses default browser behavior when the user clicks a non-left mouse button', () => {
        const fakeNewLocation = {
          pathname: '/home/things',
          search: '',
          action: 'PUSH',
          query: {}
        };

        const wrapper = shallow(
          <Link href='/home/things' />,
          fakeContext({ fakeNewLocation })
        );

        const spy = sinon.spy();
        wrapper.find('a').simulate('click', {
          ...standardClickEvent,
          button: 1,
          preventDefault: spy
        });

        expect(spy).to.not.have.been.called;
      });

      it('prevents default when the user left-clicks', () => {
        const fakeNewLocation = {
          pathname: '/home/things',
          search: '',
          action: 'PUSH',
          query: {}
        };

        const wrapper = shallow(
          <Link href='/home/things' />,
          fakeContext({ fakeNewLocation })
        );

        const spy = sinon.spy();
        wrapper.find('a').simulate('click', {
          ...standardClickEvent,
          button: 0,
          preventDefault: spy
        });

        expect(spy).to.have.been.calledOnce;
      });
    });
  });

  // We have to use mount instead of shallow here since
  // PersistentQueryLink is an HOC
  describe('Persistent query link', () => {
    describe('no query provided', () => {
      const hrefs = [
        '/home/messages/a-team',
        { pathname: '/home/messages/a-team' }
      ];

      const fakeNewLocation = {
        pathname: '/home/messages/a-team',
        search: '?test=ing',
        action: 'PUSH',
        query: { test: 'ing' }
      };

      hrefs.forEach(href => {
        it('persists previous query string if the href does not provide one', done => {
          const assertion = action => {
            if (action.type === PUSH) {
              const { payload } = action;
              captureErrors(done, () => {
                expect(payload).to.have.property('query')
                  .that.deep.equals({ test: 'ing' });
              });
            }
          };

          const wrapper = mount(
            <PersistentQueryLink href={href} />,
            fakeContext({ fakeNewLocation, assertion })
          );

          wrapper.find('a').simulate('click', standardClickEvent);
        });
      });
    });

    describe('query provided', () => {
      const hrefs = [
        '/home/messages/a-team?jawn=jawn',
        {
          pathname: '/home/messages/a-team',
          query: {
            jawn: 'jawn'
          }
        }
      ];

      const fakeNewLocation = {
        pathname: '/home/messages/a-team',
        search: '?jawn=jawn',
        action: 'PUSH',
        query: { jawn: 'jawn' }
      };

      hrefs.forEach(href => {
        it('replaces the previous query string if the href provides one', done => {
          const assertion = action => {
            if (action.type === PUSH) {
              const { payload } = action;
              captureErrors(done, () => {
                expect(payload).to.have.property('query')
                  .that.deep.equals({ jawn: 'jawn' });
              });
            }
          };

          const wrapper = mount(
            <PersistentQueryLink href={href} />,
            fakeContext({ fakeNewLocation, assertion })
          );

          wrapper.find('a').simulate('click', standardClickEvent);
        });
      });
    });
  });
});
