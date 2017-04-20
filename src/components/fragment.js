// @flow
import type { Location } from '../types';

import React, { Children, Component } from 'react';
import PropTypes from 'prop-types';
import matchCache from '../util/match-cache';
import generateId from '../util/generate-id';

type Props = {
  location: Location,
  matchRoute: Function,
  matchWildcardRoute: Function,
  forRoute?: string,
  parentRoute?: string,
  withConditions?: (location: Location) => boolean,
  parentId?: string,
  children: React.Element<*>
};

const relativePaths = (ComposedComponent: ReactClass<*>) => {
  class RelativeFragment extends Component {
    constructor() {
      super();
      this.id = generateId();
    }

    getChildContext() {
      const { parentRoute } = this.context;
      const { forRoute } = this.props;

      return {
        // Append the parent route if this isn't the first
        // RelativeFragment in the hierarchy.
        parentRoute: parentRoute &&
          parentRoute !== '/' &&
          parentRoute !== forRoute
          ? `${parentRoute}${forRoute || ''}`
          : forRoute,
        parentId: this.id
      };
    }

    props: Props;
    id: string;

    render() {
      const { children, forRoute, ...rest } = this.props;
      const { router, parentRoute, parentId } = this.context;
      const { store } = router;

      const location = store.getState().router;

      const routePrefix = parentRoute && parentRoute !== '/'
        ? parentRoute
        : '';

      const routeSuffix = (forRoute === '/' && parentRoute && parentRoute !== '/')
        ? ''
        : forRoute || '';

      const combinedRoute = forRoute && `${routePrefix}${routeSuffix}`;

      return (
        <ComposedComponent
          parentId={parentId}
          location={location}
          matchRoute={store.matchRoute}
          matchWildcardRoute={store.matchWildcardRoute}
          parentRoute={parentRoute}
          forRoute={combinedRoute}
          children={children}
          {...rest}
        />
      );
    }
  }

  // Consumes this context...
  RelativeFragment.contextTypes = {
    router: PropTypes.object,
    parentRoute: PropTypes.string,
    parentId: PropTypes.string
  };

  // ...and provides this context.
  RelativeFragment.childContextTypes = {
    parentRoute: PropTypes.string,
    parentId: PropTypes.string
  };

  return RelativeFragment;
};

const Fragment = (props: Props) => {
  const {
    location,
    matchRoute,
    matchWildcardRoute,
    forRoute,
    withConditions,
    children,
    parentId,
    parentRoute
  } = props;

  const matcher = (forRoute === parentRoute) ? matchRoute : matchWildcardRoute;
  const matchResult = matcher(location.pathname, forRoute);

  if (
    !matchResult ||
    (withConditions && !withConditions(location)) ||
    (forRoute && matchResult.route !== forRoute)
  ) {
    return null;
  }

  if (parentId) {
    const previousMatch = matchCache.get(parentId);
    if (previousMatch && previousMatch !== forRoute) {
      return null;
    } else {
      matchCache.add(parentId, forRoute);
    }
  }

  return Children.only(children);
};

export default relativePaths(Fragment);
