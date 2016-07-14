import React from 'react';
import { mount } from 'enzyme';

import { PUSH, REPLACE } from 'src/action-types';

import provideRouter from 'src/provider';
import {
  Link as RawLink,
  PersistentQueryLink as RawPersistentQueryLink
} from 'src/link';

import bootstrap from './util/bootstrap';

const { storeFactory, history } = bootstrap();

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
      hrefs.forEach(href =>
        it('dispatches a PUSH action with the correct href when clicked', done => {
          const assertion = (state, action) => {
            if (action.type === PUSH) {
              const { payload } = action;
              expect(payload).to.have.property('pathname')
                .that.contains('/home/messages/a-team');
              expect(payload).to.have.property('query')
                .that.deep.equals({ test: 'ing' });
              done();
            }
          };
          const Link = provideRouter({
            store: storeFactory(assertion),
            history
          })(RawLink);

          const wrapper = mount(
            <Link href={href} />
          );
          wrapper.find('a').simulate('click');
        })
      );
    });

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
        it('dispatches a REPLACE action with the correct href when clicked', done => {
          const assertion = (state, action) => {
            if (action.type === REPLACE) {
              const { payload } = action;
              expect(payload).to.have.property('pathname')
                .that.contains('/home/messages/a-team');
              expect(payload).to.have.property('query')
                .that.deep.equals({ test: 'ing' });
              done();
            }
          };
          const Link = provideRouter({
            store: storeFactory(assertion),
            history
          })(RawLink);

          const wrapper = mount(
            <Link replaceState href={href} />
          );
          wrapper.find('a').simulate('click');
        });
      });
    });
  });

  describe('Persistent query link', () => {
    describe('no query provided', () => {
      const hrefs = [
        '/home/messages/a-team',
        { pathname: '/home/messages/a-team' }
      ];
      hrefs.forEach(href => {
        it('persists previous query string if the href does not provide one', done => {
          const assertion = (state, action) => {
            if (action.type === PUSH) {
              const { payload } = action;
              expect(payload).to.have.property('pathname', '/home/messages/a-team');
              expect(payload).to.have.property('query')
                .that.deep.equals({ test: 'ing' });
              done();
            }
          };
          const Link = provideRouter({
            store: storeFactory(assertion),
            history
          })(RawPersistentQueryLink);

          const wrapper = mount(
            <Link href={href} />
          );
          wrapper.find('a').simulate('click');
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
          const assertion = (state, action) => {
            if (action.type === PUSH) {
              const { payload } = action;
              expect(payload).to.have.property('pathname', '/home/messages/a-team');
              expect(payload).to.have.property('query')
                .that.deep.equals({ jawn: 'jawn' });
              done();
            }
          };
          const Link = provideRouter({
            store: storeFactory(assertion),
            history
          })(RawPersistentQueryLink);

          const wrapper = mount(
            <Link href={href} />
          );
          wrapper.find('a').simulate('click');
        });
      });
    });
  });
});
