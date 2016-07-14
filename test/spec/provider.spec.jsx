import React, { Component, PropTypes } from 'react';
import { mount } from 'enzyme';

import bootstrap from './util/bootstrap';
import provideRouter from 'src/provider';

const { storeFactory, history } = bootstrap();

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
      store: storeFactory(),
      history
    })(MagicalMysteryComponent);

    const wrapper = mount(<MagicalMysteryRouter />);
    const div = wrapper.find('div');
    expect(div.node.textContent).to.equal('/home/messages/:team');
  });
});
