import {
  LOCATION_CHANGED, PUSH, REPLACE, GO, GO_BACK, GO_FORWARD
} from './action-types';

export const locationDidChange = ({ location, matchRoute }) => {
  const { basename, pathname, action, state } = location;
  const trailingSlash = /\/$/;
  const url = `${basename || ''}${pathname}`
    .replace(trailingSlash, '');

  return {
    type: LOCATION_CHANGED,
    payload: {
      ...matchRoute(url),
      action,
      state,
      url
    }
  };
};

export const initializeCurrentLocation = location => ({
  type: LOCATION_CHANGED,
  payload: location
});

export default ({ history, matchRoute }) => {
  return ({ dispatch }) => {
    history.listen(location => {
      if (location) {
        dispatch(locationDidChange({
          location, matchRoute
        }));
      }
    });

    return next => action => {
      switch (action.type) {
        case PUSH:
          history.push(action.payload);
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
        case LOCATION_CHANGED: {
          next(action);
          break;
        }
        default:
          next(action);
      }
    };
  };
};
