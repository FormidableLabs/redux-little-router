/* eslint-disable max-nested-callbacks */
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';

import qs from 'query-string';

import React from 'react';
import { shallow, mount } from 'enzyme';

import { PUSH, REPLACE } from '../../src/actions';
import { Link, PersistentQueryLink } from '../../src/components/link';

import {
  captureErrors,
  fakeContext,
  standardClickEvent
} from '../test-util';

chai.use(sinonChai);

describe('Router link component', () => {
  let createLocation;
  beforeEach(() => {
    createLocation = sandbox.stub().returns({
      pathname: '/home/messages/a-team',
      search: '?test=ing',
      action: 'PUSH',
      query: { test: 'ing' }
    });
  });

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

      hrefs.forEach(href =>
        it('dispatches a PUSH action with the correct href when clicked', done => {
          const assertion = action => {
            if (action.type === PUSH) {
              const { payload } = action;
              captureErrors(done, () => {
                expect(createLocation).to.have.been.calledOnce;
                expect(payload).to.have.property('pathname')
                  .that.contains('/home/messages/a-team');
                expect(payload).to.have.property('query')
                  .that.deep.equals({ test: 'ing' });
              });
            }
          };

          const wrapper = shallow(
            <Link href={href} createLocation={createLocation} />,
            fakeContext({ assertion })
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

      hrefs.forEach(href => {
        it('dispatches a REPLACE action with the correct href when clicked', done => {
          const assertion = action => {
            if (action.type === REPLACE) {
              const { payload } = action;
              captureErrors(done, () => {
                expect(createLocation).to.have.been.calledOnce;
                expect(payload).to.have.property('pathname')
                  .that.contains('/home/messages/a-team');
                expect(payload).to.have.property('query')
                  .that.deep.equals({ test: 'ing' });
              });
            }
          };

          const wrapper = shallow(
            <Link replaceState href={href} createLocation={createLocation} />,
            fakeContext({ assertion })
          );

          wrapper.find('a').simulate('click', standardClickEvent);
        });
      });
    });

    describe('Accessibility', () => {
      ['shiftKey', 'altKey', 'metaKey', 'ctrlKey'].forEach(modifierKey =>
        it(`uses default browser behavior when the user holds the ${modifierKey}`, () => {
          const wrapper = shallow(
            <Link href='/home/things' createLocation={createLocation} />,
            fakeContext()
          );

          const spy = sandbox.spy();
          wrapper.find('a').simulate('click', {
            ...standardClickEvent,
            [modifierKey]: true,
            preventDefault: spy
          });

          expect(createLocation).to.have.been.calledOnce;
          expect(spy).to.not.have.been.called;
        })
      );

      it('uses default browser behavior when the user clicks a non-left mouse button', () => {
        const wrapper = shallow(
          <Link href='/home/things' createLocation={createLocation} />,
          fakeContext()
        );

        const spy = sandbox.spy();
        wrapper.find('a').simulate('click', {
          ...standardClickEvent,
          button: 1,
          preventDefault: spy
        });

        expect(createLocation).to.have.been.calledOnce;
        expect(spy).to.not.have.been.called;
      });

      it('prevents default when the user left-clicks', () => {
        const wrapper = shallow(
          <Link href='/home/things' createLocation={createLocation} />,
          fakeContext()
        );

        const spy = sandbox.spy();
        wrapper.find('a').simulate('click', {
          ...standardClickEvent,
          button: 0,
          preventDefault: spy
        });

        expect(createLocation).to.have.been.calledOnce;
        expect(spy).to.have.been.calledOnce;
      });

      it('passes through DOM props, including aria attributes', () => {
        const wrapper = shallow(
          <Link
            href='/home/things'
            aria-label='a11y'
            className='classy'
            style={{
              fontFamily: 'Comic Sans'
            }}
            createLocation={createLocation}
          />,
          fakeContext()
        );

        expect(createLocation).to.have.been.calledOnce;

        const props = wrapper.props();
        expect(props).to.have.property('aria-label', 'a11y');
        expect(props).to.have.property('className', 'classy');
        expect(props).to.have.property('style')
          .that.deep.equals({
            fontFamily: 'Comic Sans'
          });
      });
    });

    describe('Rendering', () => {
      it('renders an <a /> with the correct href attribute', () => {
        const hrefs = [
          '/path',
          '/path?key=value',
          'path/with/nested/routes'
        ];
        hrefs.forEach(href => {
          const createLocationStub = sandbox.stub().returns({
            pathname: href,
            search: ''
          });
          const wrapper = shallow(
            <Link href={href} createLocation={createLocationStub} />,
            fakeContext()
          );
          expect(createLocationStub).to.have.been.calledOnce;
          expect(wrapper.find('a').prop('href')).to.equal(href);
        });
      });

      it('renders an <a /> with the correct href attribute using a basename', () => {
        const hrefs = [
          '/path',
          '/path?key=value',
          'path/with/nested/routes'
        ];
        hrefs.forEach(href => {
          const createLocationStub = sandbox.stub().returns({
            basename: '/base',
            pathname: href,
            search: ''
          });
          const wrapper = shallow(
            <Link href={href} createLocation={createLocationStub} />,
            fakeContext({ basename: '/base' })
          );
          expect(createLocationStub).to.have.been.calledOnce;
          expect(wrapper.find('a').prop('href')).to.equal(`/base${href}`);
        });
      });

      it('parses and renders location objects as hrefs', () => {
        const expected = [
          '/path',
          '/path?key=value',
          'path/with/nested/routes'
        ];
        const locations = [
          { pathname: '/path' },
          { pathname: '/path', query: { key: 'value' } },
          { pathname: 'path/with/nested/routes' }
        ];
        locations.forEach((location, index) => {
          const createLocationStub = sandbox.stub().returns({
            pathname: location.pathname,
            search: `${location.query ? '?' : ''}${qs.stringify(location.query)}`
          });
          const wrapper = shallow(
            <Link href={location} createLocation={createLocationStub} />,
            fakeContext()
          );
          expect(createLocationStub).to.have.been.calledOnce;
          expect(wrapper.find('a').prop('href')).to.equal(expected[index]);
        });
      });

      it('parses and renders location objects as hrefs using a basename', () => {
        const expected = [
          '/path',
          '/path?key=value',
          'path/with/nested/routes'
        ];
        const locations = [
          { pathname: '/path' },
          { pathname: '/path', query: { key: 'value' } },
          { pathname: 'path/with/nested/routes' }
        ];
        locations.forEach((location, index) => {
          const createLocationStub = sandbox.stub().returns({
            basename: '/base',
            pathname: location.pathname,
            search: `${location.query ? '?' : ''}${qs.stringify(location.query)}`
          });
          const wrapper = shallow(
            <Link href={location} createLocation={createLocationStub} />,
            fakeContext({ basename: '/base' })
          );
          expect(createLocationStub).to.have.been.calledOnce;
          expect(wrapper.find('a').prop('href')).to.equal(`/base${expected[index]}`);
        });
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
            <PersistentQueryLink href={href} createLocation={createLocation} />,
            fakeContext({ assertion })
          );

          expect(createLocation).to.have.been.calledOnce;
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

      hrefs.forEach(href => {
        it('replaces the previous query string if the href provides one', done => {
          const createLocationStub = sandbox.stub().returns({
            pathname: '/home/messages/a-team',
            search: '?jawn=jawn',
            action: 'PUSH',
            query: { jawn: 'jawn' }
          });

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
            <PersistentQueryLink href={href} createLocation={createLocationStub} />,
            fakeContext({ assertion })
          );

          expect(createLocationStub).to.have.been.calledOnce;
          wrapper.find('a').simulate('click', standardClickEvent);
        });
      });
    });
  });
});
