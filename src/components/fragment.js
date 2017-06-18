// @flow
/* eslint-disable react/sort-comp */
import type { Location } from '../types';

import UrlPattern from 'url-pattern';
import React, { Children, Component } from 'react';
import { connect } from 'react-redux';
import { compose, withContext, getContext } from 'recompose';
import PropTypes from 'prop-types';

import matchCache from '../util/match-cache';
import generateId from '../util/generate-id';

const withId = ComposedComponent =>
  class WithId extends Component {
    id: string;

    constructor() {
      super();
      this.id = generateId();
    }

    render() {
      return <ComposedComponent {...this.props} id={ this.id } />;
    }
  };

const resolveChildRoute = (parentRoute, currentRoute) => {
  const parentIsRootRoute =
    parentRoute &&
    parentRoute !== '/' &&
    parentRoute !== currentRoute;

  return parentIsRootRoute
    ? `${parentRoute}${currentRoute || ''}`
    : currentRoute;
};

const resolveCurrentRoute = (parentRoute, currentRoute) => {
  if (!currentRoute) { return null; }

  // First route will always be a wildcard
  if (!parentRoute) { return `${currentRoute}*`; }

  const currentIsRootRoute = currentRoute === '/';
  const parentIsRootRoute = parentRoute === '/';

  // Only prefix non-root parent routes
  const routePrefix = !parentIsRootRoute && parentRoute || '';

  // Support "index" routes:
  // <Fragment forRoute='/home'>
  //   <Fragment forRoute='/'>
  //   </Fragment>
  // </Fragment>
  const routeSuffix = currentIsRootRoute &&
    !parentIsRootRoute ? '' : currentRoute;

  const wildcard = currentIsRootRoute &&
    parentIsRootRoute ? '' : '*';

  return `${routePrefix}${routeSuffix}${wildcard}`;
};

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

class Fragment extends Component {
  matcher: ?Object;

  constructor(props: Props, context: typeof Fragment.contextTypes) {
    super(props, context);

    const currentRoute = resolveCurrentRoute(
      props.parentRoute,
      props.forRoute
    );

    this.matcher = currentRoute &&
      new UrlPattern(currentRoute) || null;
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.forRoute !== nextProps.forRoute) {
      throw new Error('Updating route props is not yet supported.');
    }
  }

  render() {
    const { matcher } = this;
    const {
      children,
      forRoute,
      withConditions,
      location,
      parentRoute,
      parentId
    } = this.props;

    const currentRoute = resolveCurrentRoute(parentRoute, forRoute);

    if (matcher && !matcher.match(location.pathname)) {
      return null;
    }

    if (withConditions && !withConditions(location)) {
      return null;
    }

    if (parentId) {
      const previousMatch = matchCache.get(parentId);
      if (previousMatch && previousMatch !== currentRoute) {
        return null;
      } else {
        matchCache.add(parentId, currentRoute);
      }
    }

    return Children.only(children);
  }
}

export default compose(
  connect(state => ({
    location: state.router
  })),
  getContext({
    parentRoute: PropTypes.string,
    parentId: PropTypes.string
  }),
  withId,
  withContext({
    parentRoute: PropTypes.string,
    parentId: PropTypes.string
  }, props => ({
    parentRoute: resolveChildRoute(
      props.parentRoute,
      props.forRoute
    ),
    parentId: props.id
  }))
)(Fragment);
