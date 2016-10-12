/* eslint-disable consistent-return */

import {
  PUSH, REPLACE, GO,
  GO_BACK, GO_FORWARD
} from './action-types';

export default ({ history }) => () => next => action => {
  switch (action.type) {
  case PUSH:
    history.push(action.payload);
    // No return, no next() here
    // We stop all history events from progressing further through the dispatch chain...
    break;
  case REPLACE:
    history.replace(action.payload);
    break;
  case GO:
    history.go(action.payload);
    break;
  case GO_BACK:
    history.goBack();
    break;
  case GO_FORWARD:
    history.goForward();
    break;
  default:
    // ...but we want to leave all events we don't care about undisturbed
    return next(action);
  }
};
