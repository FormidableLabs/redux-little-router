// @flow
import type { Location } from 'history';
import type { RouterContext } from './provider';
import React, { PropTypes } from 'react';

type Props = {
  forRoute?: string,
  forRoutes?: Array<string>,
  withConditions?: (location: Location) => bool,
  children: React.Element<*>,
  componentKey: string,
  componentPropsKey?: string
};

type Context = {
  router?: RouterContext
};

const PlaceholderFragment = (props: Props, context: Context ) => {
  const {
    forRoute,
    forRoutes,
    withConditions,
    children,
    componentKey = 'component',
    componentPropsKey = 'componentProps'
  } = props;

  const { store } = context.router;
  const { matchRoute } = store;
  const { router: location } = store.getState();

  const matchResult = matchRoute(location.pathname);

  if (!matchResult) {
    return null;
  }

  if (
    forRoute &&
    matchResult.route !== forRoute
  ) {
    return null;
  }

  if (Array.isArray(forRoutes)) {
    const anyMatch = forRoutes.some(route =>
      matchResult.route === route
    );

    if (!anyMatch) {
      return null;
    }
  }

  if (withConditions && !withConditions(location)) {
    return null;
  }

  if (matchResult && matchResult.result && matchResult.result.hasOwnProperty(componentKey)) {
    return React.createElement(
      matchResult.result[componentKey],
      matchResult.result.hasOwnProperty(componentPropsKey) ?
        matchResult.result[componentPropsKey] :
        {},
      children
    );
  }

  return null;
};

PlaceholderFragment.contextTypes = {
  router: PropTypes.object
};

export default PlaceholderFragment;
