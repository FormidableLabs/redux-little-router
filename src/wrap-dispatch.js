import {
  PUSH, REPLACE, GO,
  GO_BACK, GO_FORWARD
} from './action-types';

export default (store, history) => action => {
  switch (action.type) {
  case PUSH:
    history.push(action.payload);
    return null;
  case REPLACE:
    history.replace(action.payload);
    return null;
  case GO:
    history.go(action.payload);
    return null;
  case GO_BACK:
    history.goBack();
    return null;
  case GO_FORWARD:
    history.goForward();
    return null;
  default:
    // We return the result of dispatch here
    // to retain compatibility with enhancers
    // that return a promise from dispatch.
    return store.dispatch(action);
  }
};
