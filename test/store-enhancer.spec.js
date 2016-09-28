import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';

import { compose, createStore } from 'redux';
import { install, combineReducers } from 'redux-loop';

import {
  LOCATION_CHANGED, PUSH, REPLACE,
  GO, GO_BACK, GO_FORWARD
} from '../src/action-types';

import createStoreWithRouter from '../src/store-enhancer';

import defaultRoutes from './fixtures/routes';

chai.use(sinonChai);

const createStoreWithSpy = nextCreateStore =>
  (reducer, initialState, enhancer) => {
    const store = nextCreateStore(reducer, initialState, enhancer);
    const dispatchSpy = sandbox.spy(store, 'dispatch');
    return { ...store, dispatch: dispatchSpy, dispatchSpy };
  };

const defaultFakeInitialState = {
  router: {
    pathname: '/home/messages/a-team/pity-fool'
  }
};

const defaultReducer = store => store;

const fakeStore = ({
  initialState = defaultFakeInitialState,
  routes = defaultRoutes,
  reducer = defaultReducer,
  location = {
    pathname: '/home',
    query: {
      yo: 'yo'
    }
  },
  isLoop = false
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
    createStoreWithRouter({
      routes,
      location,
      history: historyStub
    })
  ];

  if (isLoop) {
    enhancers.push(install());
  }

  const store = createStore(
    isLoop ? combineReducers({
      stuff: state => state
    }) : reducer,
    initialState,
    compose(...enhancers)
  );

  return { store, historyStub };
};

// eslint-disable-next-line max-statements
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

  it('merges user-provided initial state with initial routing state', () => {
    const { store } = fakeStore({
      initialState: {
        not: 'my state'
      },
      location: {
        pathname: '/home',
        query: {
          yo: 'yo'
        }
      }
    });

    const state = store.getState();
    expect(state).to.have.property('not', 'my state');
    expect(state).to.have.property('router')
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
      location: {
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

  it('calls the reducer once for each action', () => {
    const reducerSpy = sandbox.spy();
    const { store } = fakeStore({ reducer: reducerSpy });
    store.dispatch({ type: 'CUSTOM_ACTION' });
    expect(reducerSpy).to.be.calledTwice;
    expect(reducerSpy.firstCall).to.have.been.calledWith({}, { type: '@@redux/INIT' });
    expect(reducerSpy.secondCall).to.have.been.calledWith({}, { type: 'CUSTOM_ACTION' });
  });
});
