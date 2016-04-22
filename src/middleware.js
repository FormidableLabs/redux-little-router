import {
  LOCATION_CHANGED, PUSH, REPLACE, GO, GO_BACK, GO_FORWARD
} from './action-types';

const locationDidChange = location => {
  const { basename, pathname } = location;
  return {
    type: LOCATION_CHANGED,
    payload: `${basename || ''}${pathname}`
      .replace(/\/$/, '') // remove trailing slash
  };
};

let locationListener;

export default history => {
  return () => next => action => {
    if (!locationListener) {
      locationListener = history.listen(location => {
        next(locationDidChange(location));
      });
    }

    switch (action.type) {
      case PUSH:
        history.push(action.payload.pathname);
        break;
      case REPLACE:
        history.replace(action.payload.pathname);
        break;
      case GO:
        history.go(action.payload.index);
        break;
      case GO_BACK:
        history.goBack();
        break;
      case GO_FORWARD:
        history.goForward();
        break;
      case LOCATION_CHANGED:
        break;
      default:
        next(action);
    }
  };
};
