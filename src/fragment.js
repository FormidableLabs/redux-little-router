// @flow
import type { Location } from 'history';

import React, { Component, PropTypes } from 'react';

import extractFragmentRoutes from './util/extract-fragment-routes';

type RelativeProps = {
  location: Location,
  matchRoute: Function,
  forRoute?: string,
  withConditions?: (location: Location) => bool,
  children: React.Element<*>
};

type AbsoluteProps = RelativeProps & {
  forRoutes?: [string]
};

const absolute = (ComposedComponent: ReactClass<*>) => {
  class AbsoluteFragment extends Component {
    props: AbsoluteProps;

    render() {
      const { store } = this.context.router;
      const location = store.getState().router;

      return (
        <ComposedComponent
          location={location}
          matchRoute={store.matchRoute}
          {...this.props}
        />
      );
    }
  }

  AbsoluteFragment.contextTypes = {
    router: PropTypes.object
  };

  return AbsoluteFragment;
};

const relative = (ComposedComponent: ReactClass<*>) => {
  class RelativeFragment extends Component {
    getChildContext() {
      return {
        // Append the parent route if this isn't the first
        // RelativeFragment in the hierarchy.
        parentRoute: this.context.parentRoute &&
          this.context.parentRoute !== this.props.forRoute
            ? `${this.context.parentRoute}${this.props.forRoute}`
            : this.props.forRoute
      };
    }

    props: RelativeProps;

    render() {
      const { forRoute, children, ...rest } = this.props;
      const { router, parentRoute } = this.context;
      const { store } = router;

      const location = store.getState().router;

      const mergedForRoutes =
        extractFragmentRoutes(children, forRoute)
          .map(route => `${parentRoute || ''}${route}`);

      return (
        <ComposedComponent
          location={location}
          matchRoute={store.matchRoute}
          forRoutes={mergedForRoutes}
          children={children}
          {...rest}
        />
      );
    }
  }

  // Consumes this context...
  RelativeFragment.contextTypes = {
    router: PropTypes.object,
    parentRoute: PropTypes.string
  };

  // ...and provides this context.
  RelativeFragment.childContextTypes = {
    parentRoute: PropTypes.string
  };

  return RelativeFragment;
};

type Props = AbsoluteProps | RelativeProps;

const Fragment = (props: Props) => {
  const {
    location,
    matchRoute,
    forRoute,
    withConditions,
    children
  } = props;

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

  if (Array.isArray(props.forRoutes)) {
    const anyMatch = props.forRoutes.some(route =>
      matchResult.route === route
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

export const AbsoluteFragment = absolute(Fragment);
export const RelativeFragment = relative(Fragment);
