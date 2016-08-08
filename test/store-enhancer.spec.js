import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { compose, createStore } from 'redux';
import { install, combineReducers } from 'redux-loop';
import createMemoryHistory from 'history/lib/createMemoryHistory';

import {
  LOCATION_CHANGED, PUSH, REPLACE,
  GO, GO_BACK, GO_FORWARD
} from '../src/action-types';

import createStoreWithRouter, {
  locationDidChange,
  initializeCurrentLocation
} from '../src/store-enhancer';

chai.use(sinonChai);

const createStoreWithSpy = nextCreateStore =>
  (reducer, initialState, enhancer) => {
    const store = nextCreateStore(reducer, initialState, enhancer);
    const dispatchSpy = sinon.spy(store, 'dispatch');
    return {...store, dispatch: dispatchSpy, dispatchSpy};
  };

const fakeStore = ({
  useHistoryStub = true,
  isLoop = false,
  enhancerOptions = {}
} = {}) => {
  const historyStub = sinon.stub(createMemoryHistory());
  const initialState = {
    router: {
      pathname: '/home/messages/a-team/pity-fool'
    }
  };
  const enhancers = [
    createStoreWithSpy,
    useHistoryStub ? createStoreWithRouter({
      history: historyStub,
      routes: {},
      ...enhancerOptions
    }) : createStoreWithRouter({
      routes: {},
      ...enhancerOptions
    })
  ];

  if (isLoop) {
    enhancers.push(install());
  }

  const store = createStore(
    isLoop ? combineReducers({
      stuff: state => state
    }) : state => state,
    initialState,
    compose(...enhancers)
  );

  return { store, historyStub };
};

describe('Router store enhancer', () => {
  it('updates the pathname in the state tree after dispatching history actions', done => {
    const { store } = fakeStore();

    store.subscribe(() => {
      const state = store.getState();
      expect(state).to.have.deep.property('router.result')
        .that.deep.equals({ name: 'channel' });
      done();
    });

    store.dispatch({
      type: LOCATION_CHANGED,
      payload: {
        pathname: '/home/messages/a-team/fool-pity',
        result: {
          name: 'channel'
        }
      }
    });
  });

  it('can create its own browser history', done => {
    const { store } = fakeStore({
      useHistoryStub: false,
      enhancerOptions: {
        forServerRender: false
      }
    });

    store.subscribe(() => {
      const state = store.getState();
      expect(state).to.have.deep.property('router.result')
        .that.deep.equals({ name: 'channel' });
      done();
    });

    store.dispatch({
      type: LOCATION_CHANGED,
      payload: {
        pathname: '/home/messages/a-team/fool-pity',
        result: {
          name: 'channel'
        }
      }
    });
  });

  it('can create its own server history', done => {
    const { store } = fakeStore({
      useHistoryStub: false,
      enhancerOptions: {
        forServerRender: true
      }
    });

    store.subscribe(() => {
      const state = store.getState();
      expect(state).to.have.deep.property('router.result')
        .that.deep.equals({ name: 'channel' });
      done();
    });

    store.dispatch({
      type: LOCATION_CHANGED,
      payload: {
        pathname: '/home/messages/a-team/fool-pity',
        result: {
          name: 'channel'
        }
      }
    });
  });

  it('supports Redux Loop', done => {
    const { store } = fakeStore({ isLoop: true });

    store.subscribe(() => {
      const state = store.getState();
      expect(state).to.have.deep.property('router.result')
        .that.deep.equals({ name: 'channel' });
      done();
    });

    store.dispatch({
      type: LOCATION_CHANGED,
      payload: {
        pathname: '/home/messages/a-team/fool-pity',
        result: {
          name: 'channel'
        }
      }
    });
  });

  it('combines the location descriptor and the route match into a LOCATION_CHANGED action', () => {
    const locationChangedAction = locationDidChange({
      location: {
        action: 'PUSH',
        basename: '/test',
        pathname: '/things',
        query: {
          test: 'ing'
        }
      },
      matchRoute: sinon.stub().returns({
        params: {
          fakeParam: 'things'
        },
        result: {
          title: 'things'
        }
      })
    });

    expect(locationChangedAction).to.deep.equal({
      type: LOCATION_CHANGED,
      payload: {
        action: 'PUSH',
        basename: '/test',
        pathname: '/things',
        query: {
          test: 'ing'
        },
        params: {
          fakeParam: 'things'
        },
        result: {
          title: 'things'
        }
      }
    });
  });

  it('creates a LOCATION_CHANGED action for an existing location/match result combo', () => {
    const expectedLocation = {
      action: 'PUSH',
      basename: '/test',
      pathname: '/things',
      query: {
        test: 'ing'
      },
      params: {
        fakeParam: 'things'
      },
      result: {
        title: 'things'
      }
    };
    const initialLocationAction = initializeCurrentLocation(expectedLocation);
    expect(initialLocationAction).to.deep.equal({
      type: LOCATION_CHANGED,
      payload: expectedLocation
    });
  });

  it('dispatches a LOCATION_CHANGED action on location change', () => {
    const { store, historyStub } = fakeStore();
    store.dispatch({
      type: PUSH,
      payload: {}
    });

    expect(historyStub.push).to.be.calledOnce;
    expect(store.dispatchSpy).to.be.calledOnce;
  });

  const actionMethodMap = {
    [PUSH]: 'push',
    [REPLACE]: 'replace',
    [GO]: 'go',
    [GO_BACK]: 'goBack',
    [GO_FORWARD]: 'goForward'
  };

  Object.keys(actionMethodMap).forEach(actionType => {
    const method = actionMethodMap[actionType];

    it(`calls history.${method} when intercepting ${actionType}`, () => {
      const { store, historyStub } = fakeStore();
      store.dispatch({
        type: actionType,
        payload: {
          pathname: '/nonsense'
        }
      });

      expect(historyStub[method]).to.have.been.calledOnce;
    });
  });

  it('passes normal actions through the dispatch chain', () => {
    const { store, historyStub } = fakeStore();
    store.dispatch({
      type: 'NOT_MY_ACTION_NOT_MY_PROBLEM',
      payload: {}
    });

    Object.keys(actionMethodMap).forEach(actionType => {
      const method = actionMethodMap[actionType];
      expect(historyStub[method]).to.not.have.been.called;
    });
    expect(store.dispatchSpy).to.be.calledOnce;
  });
});
