/* eslint-disable max-nested-callbacks */
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';

import React from 'react';
import { mount } from 'enzyme';

import { PUSH, REPLACE } from '../../src/types';
import {
  Link as LinkComponent,
  PersistentQueryLink as PersistentQueryLinkComponent
} from '../../src/components/link';
import { ImmutableLink, ImmutablePersistentQueryLink } from '../../src/immutable/components/link';

import { captureErrors, fakeContext, fakeImmutableContext, standardClickEvent } from '../test-util';

chai.use(sinonChai);

const linkTest = {
  Link: LinkComponent,
  context: fakeContext,
  testLabel: 'Link'
};
const immutableLinkTest = {
  Link: ImmutableLink,
  context: fakeImmutableContext,
  testLabel: 'ImmutableLink'
};

[linkTest, immutableLinkTest].forEach(({
  Link,
  context,
  testLabel
}) => {
  describe(`${testLabel}`, () => {
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
                expect(payload).to.have
                  .property('pathname')
                  .that.contains('/home/messages/a-team');

                if (typeof href === 'string') {
                  expect(payload).to.have
                    .property('search')
                    .that.equal('?test=ing');
                } else {
                  expect(payload).to.have
                    .property('query')
                    .that.deep.equals({ test: 'ing' });
                }
              });
            }
          };

          const wrapper = mount(
            <Link href={href} />,
            context({ assertion })
          );

          wrapper.find('a').simulate('click', standardClickEvent);
        });

        it('dispatches a PUSH action with the persistQuery option', done => {
          const assertion = action => {
            if (action.type === PUSH) {
              const { payload } = action;
              captureErrors(done, () => {
                expect(payload).to.have.nested.property(
                  'options.persistQuery',
                  true
                );
              });
            }
          };

          const wrapper = mount(
            <Link href={href} persistQuery />,
            context({ assertion })
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
                expect(payload).to.have
                  .property('pathname')
                  .that.contains('/home/messages/a-team');

                if (typeof href === 'string') {
                  expect(payload).to.have
                    .property('search')
                    .that.equal('?test=ing');
                } else {
                  expect(payload).to.have.deep
                    .property('query')
                    .that.deep.equals({ test: 'ing' });
                }
              });
            }
          };

          const wrapper = mount(
            <Link replaceState href={href} />,
            context({ assertion })
          );

          wrapper.find('a').simulate('click', standardClickEvent);
        });
      });
    });

    describe('Accessibility', () => {
      ['shiftKey', 'altKey', 'metaKey', 'ctrlKey'].forEach(modifierKey =>
        it(`uses default browser behavior when the user holds the ${modifierKey}`, () => {
          const wrapper = mount(<Link href="/home/things" />, context());

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
        const wrapper = mount(<Link href="/home/things" />, context());

        const spy = sandbox.spy();
        wrapper.find('a').simulate('click', {
          ...standardClickEvent,
          button: 1,
          preventDefault: spy
        });

        expect(spy).to.not.have.been.called;
      });

      it('prevents default when the user left-clicks', () => {
        const wrapper = mount(<Link href="/home/things" />, context());

        const spy = sandbox.spy();
        wrapper.find('a').simulate('click', {
          ...standardClickEvent,
          button: 0,
          preventDefault: spy
        });

        expect(spy).to.have.been.calledOnce;
      });

      it('passes through DOM props, including aria attributes', () => {
        const wrapper = mount(
          <Link
            href="/home/things"
            aria-label="a11y"
            className="classy"
            style={{
              fontFamily: 'Comic Sans'
            }}
          />,
          context()
        );

        const props = wrapper.props();
        expect(props).to.have.property('aria-label', 'a11y');
        expect(props).to.have.property('className', 'classy');
        expect(props).to.have.property('style').that.deep.equals({
          fontFamily: 'Comic Sans'
        });
      });

      it('calls the onClick prop if provided', () => {
        const onClick = sandbox.stub();
        const wrapper = mount(
          <Link href="/home/things" onClick={onClick} />,
          context()
        );

        wrapper.find('a').simulate('click', standardClickEvent);

        expect(onClick).to.have.been.calledOnce;
      });
    });

    describe('Rendering', () => {
      it('renders an <a /> with the correct href attribute', () => {
        const hrefs = ['/path', '/path?key=value', 'path/with/nested/routes'];
        hrefs.forEach(href => {
          const wrapper = mount(<Link href={href} />, context());
          expect(wrapper.find('a').prop('href')).to.equal(href);
        });
      });

      it('renders an <a /> with the correct href attribute using a basename', () => {
        const hrefs = ['/path', '/path?key=value', 'path/with/nested/routes'];
        hrefs.forEach(href => {
          const wrapper = mount(
            <Link href={href} />,
            context({ basename: '/base' })
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
          const wrapper = mount(<Link href={location} />, context());
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
          const wrapper = mount(
            <Link href={location} />,
            context({ basename: '/base' })
          );
          expect(wrapper.find('a').prop('href')).to.equal(
            `/base${expected[index]}`
          );
        });
      });

      it('renders the correct href when persisting queries', () => {
        const onClick = sandbox.stub();
        const wrapper = mount(
          <Link persistQuery href="/home?what=do" onClick={onClick} />,
          context({
            query: { persist: 'pls' }
          })
        );

        expect(wrapper.find('a').prop('href')).to.equal(
          '/home?persist=pls&what=do'
        );
      });

      it('renders activeProps when the href pathname matches the current pathname', () => {
        const wrapper = mount(
          <Link
            href="/mr-jackpots"
            activeProps={{
              style: { color: 'red' }
            }}
          />,
          context({
            pathname: '/mr-jackpots'
          })
        );

        expect(wrapper.find('a').prop('style')).to.have.property('color', 'red');
      });

      it('renders without activeProps when href and location pathname do not match', () => {
        const wrapper = mount(
          <Link
            href="/hello-oo-ooooooooo"
            activeProps={{
              style: { color: 'red' }
            }}
          />,
          context({
            pathname: '/mr-jackpots'
          })
        );

        expect(wrapper.find('a').prop('style')).to.be.undefined;
      });
    });
  });
});

const persistentQueryLinkTest = {
  PersistentQueryLink: PersistentQueryLinkComponent,
  context: fakeContext,
  testLabel: 'PersistentQueryLink'
};
const immutablePersistentQueryLinkTest = {
  PersistentQueryLink: ImmutablePersistentQueryLink,
  context: fakeImmutableContext,
  testLabel: 'ImmutablePersistentQueryLink'
};

[persistentQueryLinkTest, immutablePersistentQueryLinkTest].forEach(({
  PersistentQueryLink,
  context,
  testLabel
}) => {
  describe(`${testLabel}`, () => {
    it('appends persistQuery to the props', () => {
      const wrapper = mount(<PersistentQueryLink href="/" />, context());
      const link = wrapper.findWhere(node => node.name() === 'LinkComponent');

      expect(link.props()).to.have.property('persistQuery', true);
    });
  });
});
