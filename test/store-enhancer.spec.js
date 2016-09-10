import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';

import { compose, createStore } from 'redux';
import { install, combineReducers } from 'redux-loop';

import {
  LOCATION_CHANGED, PUSH, REPLACE,
  GO, GO_BACK, GO_FORWARD
} from '../src/action-types';

import createStoreWithRouter, {
  locationDidChange,
  initializeCurrentLocation
} from '../src/store-enhancer';

import defaultRoutes from './fixtures/routes';

chai.use(sinonChai);

const createStoreWithSpy = nextCreateStore =>
  (reducer, initialState, enhancer) => {
    const store = nextCreateStore(reducer, initialState, enhancer);
    const dispatchSpy = sandbox.spy(store, 'dispatch');
    return {...store, dispatch: dispatchSpy, dispatchSpy};
  };

const defaultFakeInitialState = {
  router: {
    pathname: '/home/messages/a-team/pity-fool'
  }
};

const fakeStore = ({
  initialState = defaultFakeInitialState,
  routes = defaultRoutes,
  useHistoryStub = true,
  isLoop = false,
  enhancerOptions = {}
} = {}) => {
  const historyStub = {
    push: sandbox.stub(),
    replace: sandbox.stub(),
    go: sandbox.stub(),
    goBack: sandbox.stub(),
    goForward: sandbox.stub(),
    listen: sandbox.stub(),
    createLocation: () => ({
      pathname: '/home',
      query: {
        yo: 'yo'
      }
    })
  };

  const enhancers = [
    createStoreWithSpy,
    useHistoryStub ? createStoreWithRouter({
      history: historyStub,
      routes,
      ...enhancerOptions
    }) : createStoreWithRouter({
      routes,
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
  it('throws if no routes are provided', () => {
    expect(() => fakeStore({
      routes: null
    })).to.throw(Error);
  });

  it('throws if malformed routes are provided', () => {
    expect(() => fakeStore({
      routes: {
        'jlshdkfjgh': {},
        '/real-route': {},
        'w': 'tf'
      }
    })).to.throw(Error);
  });

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

  it('creates initial routing state if a pathname or query are provided', () => {
    const { store } = fakeStore({
      initialState: {},
      enhancerOptions: {
        pathname: '/home',
        query: {
          yo: 'yo'
        }
      }
    });

    expect(store.getState()).to.have.property('router')
      .that.deep.equals({
        pathname: '/home',
        query: { yo: 'yo' },
        route: '/home',
        params: {},
        result: { name: 'home' }
      });
  });

  it('creates initial routing state if provided initial state is falsy', () => {
    const { store } = fakeStore({
      initialState: null,
      enhancerOptions: {
        pathname: '/home',
        query: {
          yo: 'yo'
        }
      }
    });

    expect(store.getState()).to.have.property('router')
      .that.deep.equals({
        pathname: '/home',
        query: { yo: 'yo' },
        route: '/home',
        params: {},
        result: { name: 'home' }
      });
  });

  it('passes initial state through if no pathname or query are provided', () => {
    const { store } = fakeStore();
    expect(store.getState()).to.have.deep.property(
      'router.pathname',
      '/home/messages/a-team/pity-fool'
    );
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
      matchRoute: sandbox.stub().returns({
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
