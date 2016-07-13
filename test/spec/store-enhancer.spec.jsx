import { PUSH } from 'src/action-types';

import bootstrap from './util/bootstrap';
const { storeFactory } = bootstrap();

describe('Router store enhancer', () => {
  it('updates the pathname in the state tree after dispatching history actions', done => {
    const store = storeFactory();

    store.subscribe(() => {
      const state = store.getState();
      expect(state).to.have.deep.property('router.result')
        .that.deep.equals({ name: 'channel' });
      done();
    });

    store.dispatch({
      type: PUSH,
      payload: {
        pathname: '/home/messages/a-team/fool-pity'
      }
    });
  });
});
