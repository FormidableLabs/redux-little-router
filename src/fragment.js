// @flow
import type { Location } from 'history';
import type { RouterContext } from './provider';

import React, { PropTypes } from 'react';

type Props = {
  forRoute: string,
  forRoutes: [string],
  withConditions: (location: Location) => bool,
  children: ReactPropTypes.node
};

const Fragment = (
  props: Props,
  context: {
    router: RouterContext
  }
) => {
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

Fragment.contextTypes = {
  router: PropTypes.object
};

export default Fragment;
