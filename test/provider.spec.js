import { expect } from 'chai';
import { mount } from 'enzyme';

import React, { Component, PropTypes } from 'react';

import provideRouter from '../src/provider';

import { fakeStore } from './util';

describe('provideRouter', () => {
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
