import { expect } from 'chai';
import { mount } from 'enzyme';

import React, { Component, PropTypes } from 'react';

import provideRouter, { RouterProvider } from '../../src/components/provider';

import { fakeStore } from '../test-util';
import routesFixture from '../test-util/fixtures/routes';

describe('Router provider', () => {
  describe('provideRouter HoC', () => {
    it('adds router context to a child tree', () => {
      class MagicalMysteryComponent extends Component {
        render() {
          const state = this.context.router.store.getState();
          return <div>{state.router.pathname}</div>;
        }
      }

      MagicalMysteryComponent.contextTypes = {
        router: PropTypes.object
      };

      const MagicalMysteryRouter = provideRouter({
        store: fakeStore()
      })(MagicalMysteryComponent);

      const wrapper = mount(<MagicalMysteryRouter />);
      const div = wrapper.find('div');
      expect(div.node.textContent).to.equal('/home/messages/b-team');
    });
  });

  describe('RouterProvider component', () => {
    it('adds router context to a child tree', () => {
      class MagicalMysteryComponent extends Component {
        render() {
          const state = this.context.router.store.getState();
          return <div>{state.router.pathname}</div>;
        }
      }

      MagicalMysteryComponent.contextTypes = {
        router: PropTypes.object
      };

      const wrapper = mount(
        <RouterProvider store={fakeStore()}>
          <MagicalMysteryComponent />
        </RouterProvider>
      );

      const div = wrapper.find('div');
      expect(div.node.textContent).to.equal('/home/messages/b-team');
    });

    it('adds router location props to its child component', () => {
      class MagicalMysteryComponent extends Component {
        render() {
          return <div>{this.props.router.pathname}</div>;
        }
      }

      MagicalMysteryComponent.propTypes = {
        router: PropTypes.object
      };

      const wrapper = mount(
        <RouterProvider store={fakeStore()}>
          <MagicalMysteryComponent />
        </RouterProvider>
      );

      const div = wrapper.find('div');
      expect(div.node.textContent).to.equal('/home/messages/b-team');
    });

    it('passes down unserializable route results', () => {
      class NoopComponent extends Component {
        render() {
          return <p>lol</p>;
        }
      }

      class MagicalMysteryComponent extends Component {
        render() {
          return <div>{this.props.router.pathname}</div>;
        }
      }

      MagicalMysteryComponent.propTypes = {
        router: PropTypes.object
      };

      const routesWithComponent = {
        ...routesFixture,
        '/home/messages/:team': {
          ...routesFixture['/home/messages/:team'],
          component: NoopComponent
        }
      };

      const wrapper = mount(
        <RouterProvider store={fakeStore({ routes: routesWithComponent })}>
          <MagicalMysteryComponent />
        </RouterProvider>
      );

      const childProps = wrapper.find(MagicalMysteryComponent).props();
      expect(childProps).to.have.deep.property('router.result.component')
        .that.equals(NoopComponent);
    });
  });
});
