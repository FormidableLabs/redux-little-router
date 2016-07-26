import React, { PropTypes } from 'react';
import UrlPattern from 'url-pattern';

const Fragment = (props, context) => {
  const { forRoute, forRoutes, withConditions, children } = props;
  const { router: location } = context.router.store.getState();

  if (
    forRoute &&
    !new UrlPattern(forRoute).match(location.pathname)
  ) {
    return null;
  }

  if (forRoutes) {
    const anyMatch = forRoutes.some(route =>
      new UrlPattern(route).match(location.pathname)
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
