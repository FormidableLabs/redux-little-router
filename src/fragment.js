import React, { PropTypes } from 'react';

const Fragment = (props, context) => {
  const { forRoute, forRoutes, withConditions, children } = props;
  const { store } = context.router;
  const { matchRoute } = store;
  const { router: location } = store.getState();

  if (
    forRoute &&
    matchRoute(location.pathname).route !== forRoute
  ) {
    return null;
  }

  if (forRoutes) {
    const anyMatch = forRoutes.some(route =>
      matchRoute(location.pathname).route === route
    );

    if (!anyMatch) {
      return null;
    }
  }

  if (withConditions && !withConditions(location)) {
    return null;
  }

  return <div>{children}</div>;
};

Fragment.propTypes = {
  forRoute: PropTypes.string,
  forRoutes: PropTypes.arrayOf(PropTypes.string),
  withConditions: PropTypes.func,
  children: PropTypes.node
};

Fragment.contextTypes = {
  router: PropTypes.object
};

export default Fragment;
