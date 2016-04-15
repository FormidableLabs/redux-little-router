import React from 'react';
import { mount } from 'enzyme';

import { PUSH } from 'src/action-types';
import Link from 'src/link';

describe('Router link component', () => {
  it('dispatches a PUSH action with the correct href when clicked', done => {
    const dispatch = action => {
      expect(action).to.deep.equal({
        type: PUSH,
        payload: {
          pathname: '/yo'
        }
      });
      done();
    };
    const wrapper = mount(
      <Link dispatch={dispatch} href='/yo' />
    );
    wrapper.find('a').simulate('click');
  });
});
