/* eslint-disable max-nested-callbacks */
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';

import React from 'react';
import { shallow } from 'enzyme';

import { PUSH, REPLACE } from '../../src/types';
import { Link } from '../../src/components/link';

import {
  captureErrors,
  fakeContext,
  standardClickEvent
} from '../test-util';

chai.use(sinonChai);

describe('Router link component', () => {
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

    hrefs.forEach(href => {
      it('dispatches a PUSH action with the correct href when clicked', done => {
        const assertion = action => {
          if (action.type === PUSH) {
            const { payload } = action;
            captureErrors(done, () => {
              expect(payload).to.have.property('pathname')
                .that.contains('/home/messages/a-team');

              if (typeof href === 'string') {
                expect(payload).to.have.property('search')
                  .that.equal('?test=ing');
              } else {
                expect(payload).to
                  .have.deep.property('state.reduxLittleRouter.query')
                  .that.deep.equals({ test: 'ing' });
              }
            });
          }
        };

        const wrapper = shallow(
          <Link href={href} />,
          fakeContext({ assertion })
        );

        wrapper.find('a').simulate('click', standardClickEvent);
      });

      it('dispatches a PUSH action with the persistQuery option', done => {
        const assertion = action => {
          if (action.type === PUSH) {
            const { payload } = action;
            captureErrors(done, () => {
              expect(payload).to.have.deep.property(
                'state.reduxLittleRouter.options.persistQuery', true
              );
            });
          }
        };

        const wrapper = shallow(
          <Link href={href} persistQuery />,
          fakeContext({ assertion })
        );

        wrapper.find('a').simulate('click', standardClickEvent);
      });
    });
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
              expect(payload).to.have.property('pathname')
                .that.contains('/home/messages/a-team');

              if (typeof href === 'string') {
                expect(payload).to.have.property('search')
                  .that.equal('?test=ing');
              } else {
                expect(payload).to
                  .have.deep.property('state.reduxLittleRouter.query')
                  .that.deep.equals({ test: 'ing' });
              }
            });
          }
        };

        const wrapper = shallow(
          <Link replaceState href={href} />,
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
          <Link href='/home/things' />,
          fakeContext()
        );

        const spy = sandbox.spy();
        wrapper.find('a').simulate('click', {
          ...standardClickEvent,
          [modifierKey]: true,
          preventDefault: spy
        });

        expect(spy).to.not.have.been.called;
      })
    );

    it('uses default browser behavior when the user clicks a non-left mouse button', () => {
      const wrapper = shallow(
        <Link href='/home/things' />,
        fakeContext()
      );

      const spy = sandbox.spy();
      wrapper.find('a').simulate('click', {
        ...standardClickEvent,
        button: 1,
        preventDefault: spy
      });

      expect(spy).to.not.have.been.called;
    });

    it('prevents default when the user left-clicks', () => {
      const wrapper = shallow(
        <Link href='/home/things' />,
        fakeContext()
      );

      const spy = sandbox.spy();
      wrapper.find('a').simulate('click', {
        ...standardClickEvent,
        button: 0,
        preventDefault: spy
      });

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
        />,
        fakeContext()
      );

      const props = wrapper.props();
      expect(props).to.have.property('aria-label', 'a11y');
      expect(props).to.have.property('className', 'classy');
      expect(props).to.have.property('style')
        .that.deep.equals({
          fontFamily: 'Comic Sans'
        });
    });

    it('calls the onClick prop if provided', () => {
      const onClick = sandbox.stub();
      const wrapper = shallow(
        <Link href='/home/things' onClick={onClick} />,
        fakeContext()
      );

      wrapper.find('a').simulate('click', standardClickEvent);

      expect(onClick).to.have.been.calledOnce;
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
        const wrapper = shallow(
          <Link href={href} />,
          fakeContext()
        );
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
        const wrapper = shallow(
          <Link href={href} />,
          fakeContext({ basename: '/base' })
        );
        expect(wrapper.find('a').prop('href')).to.equal(`/base${href}`);
      });
    });

    it('parses and renders location objects as hrefs', () => {
      const expected = [
        '/path',
        '/path?key=value',
        '/path?please=clap',
        'path/with/nested/routes'
      ];
      const locations = [
        { pathname: '/path' },
        { pathname: '/path', query: { key: 'value' } },
        { pathname: '/path', search: '?please=clap' },
        { pathname: 'path/with/nested/routes' }
      ];
      locations.forEach((location, index) => {
        const wrapper = shallow(
          <Link href={location} />,
          fakeContext()
        );
        expect(wrapper.find('a').prop('href')).to.equal(expected[index]);
      });
    });

    it('parses and renders location objects as hrefs using a basename', () => {
      const expected = [
        '/path',
        '/path?key=value',
        '/path?please=clap',
        'path/with/nested/routes'
      ];
      const locations = [
        { pathname: '/path' },
        { pathname: '/path', query: { key: 'value' } },
        { pathname: '/path', search: '?please=clap' },
        { pathname: 'path/with/nested/routes' }
      ];
      locations.forEach((location, index) => {
        const wrapper = shallow(
          <Link href={location} />,
          fakeContext({ basename: '/base' })
        );
        expect(wrapper.find('a').prop('href')).to.equal(`/base${expected[index]}`);
      });
    });
  });
});
