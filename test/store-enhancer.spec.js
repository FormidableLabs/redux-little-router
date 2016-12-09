import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';

import { compose, createStore, applyMiddleware } from 'redux';
import { install, combineReducers } from 'redux-loop';

import {
  LOCATION_CHANGED, PUSH
} from '../src/action-types';

import createStoreWithRouter from '../src/store-enhancer';
import routerMiddleware from '../src/middleware';

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
  isLoop = false,
  passRouterStateToReducer = false
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
      history: historyStub,
      passRouterStateToReducer
    }),
    applyMiddleware(
      routerMiddleware({ history: historyStub })
    )
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

  it('updates pathname and query in the state tree on browser location change', () => {
    const { store, historyStub } = fakeStore();
    historyStub.listen.yield({
      pathname: '/home/messages',
      search: 'yo=yo',
      hash: ''
    });

    // this would be simpilar with Chai 4 and expect(...).to.deep.include({...})
    // https://github.com/chaijs/chai/issues/781
    const state = store.getState();
    expect(state).to.have.deep.property('router.pathname', '/home/messages');
    expect(state).to.have.deep.property('router.query.yo', 'yo');
    expect(state).to.have.deep.property('router.result.name', 'messages');
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

  it('does not pass router state to the enhanced/vanilla reducer by default', () => {
    const reducerSpy = sandbox.spy(state => {
      expect(state).to.not.have.property('router');
      return state;
    });
    fakeStore({ reducer: reducerSpy });
    expect(reducerSpy).to.be.calledOnce;
  });

  it('passes router state to the enhanced/vanilla reducer when requested', () => {
    const reducerSpy = sandbox.spy(state => {
      expect(state).to.have.property('router');
      return state;
    });
    fakeStore({
      reducer: reducerSpy,
      passRouterStateToReducer: true
    });
    expect(reducerSpy).to.be.calledOnce;
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

  it('calls the reducer once for each action', () => {
    const reducerSpy = sandbox.spy(state => state);
    const { store } = fakeStore({ reducer: reducerSpy });
    store.dispatch({ type: 'CUSTOM_ACTION' });
    expect(reducerSpy).to.be.calledTwice;
    expect(reducerSpy.firstCall.args[1]).to.deep.equal({ type: '@@redux/INIT' });
    expect(reducerSpy.secondCall.args[1]).to.deep.equal({ type: 'CUSTOM_ACTION' });
  });
});
