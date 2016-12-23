// @flow
import type { Location } from '../types';

import React, { Component, PropTypes } from 'react';
import matchCache from '../util/match-cache';
import generateId from '../util/generate-id';

type Props = {
  location: Location,
  matchRoute: Function,
  forRoute?: string,
  withConditions?: (location: Location) => bool,
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
        parentRoute:
          parentRoute &&
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

      const routePrefix = parentRoute &&
        parentRoute !== '/' ? parentRoute : '';

      return (
        <ComposedComponent
          parentId={parentId}
          location={location}
          matchRoute={store.matchWildcardRoute}
          forRoute={forRoute && `${routePrefix}${forRoute}`}
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
    forRoute,
    withConditions,
    children,
    parentId
  } = props;

  const matchResult = matchRoute(location.pathname, forRoute);

  if (
    !matchResult ||
    withConditions && !withConditions(location) ||
    forRoute && matchResult.route !== forRoute
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

  return <div>{children}</div>;
};

export default relativePaths(Fragment);
