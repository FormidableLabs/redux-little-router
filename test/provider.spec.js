import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { mount } from 'enzyme';

import React, { Component, PropTypes } from 'react';
import createMemoryHistory from 'history/lib/createMemoryHistory';

import provideRouter from '../src/provider';

import { fakeStore } from './util';

chai.use(sinonChai);

describe('provideRouter', () => {
  it('adds router context to a child tree', () => {
    class MagicalMysteryComponent extends Component {
      render() {
        return <div>{this.context.router.store.getState().router.pathname}</div>;
      }
    }

    MagicalMysteryComponent.contextTypes = {
      router: PropTypes.object
    };

    const MagicalMysteryRouter = provideRouter({
      store: fakeStore(),
      history: sinon.stub(createMemoryHistory())
    })(MagicalMysteryComponent);

    const wrapper = mount(<MagicalMysteryRouter />);
    const div = wrapper.find('div');
    expect(div.node.textContent).to.equal('/home/messages/b-team');
  });
});
