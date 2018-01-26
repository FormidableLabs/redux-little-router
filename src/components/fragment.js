// @flow
/* eslint-disable react/sort-comp */
import type { Node } from 'react';
import type { MapStateToProps } from 'react-redux';
import type { Location } from '../types';

import UrlPattern from 'url-pattern';
import React, { Children, Component } from 'react';
import { connect } from 'react-redux';
import { compose, withContext, getContext } from 'recompose';
import PropTypes from 'prop-types';

import matchCache from '../util/match-cache';
import generateId from '../util/generate-id';
import throwError from '../util/throw-error';

const withId = ComposedComponent =>
  class WithId extends Component<*> {
    id: string;

    constructor() {
      super();
      this.id = generateId();
    }

    render() {
      return <ComposedComponent {...this.props} id={this.id} />;
    }
  };

const resolveChildRoute = (parentRoute, currentRoute) => {
  const parentIsRootRoute =
    parentRoute && parentRoute !== '/' && parentRoute !== currentRoute;

  return parentIsRootRoute
    ? `${parentRoute}${currentRoute || ''}`
    : currentRoute;
};

const resolveCurrentRoute = (parentRoute, currentRoute) => {
  if (!currentRoute) {
    return null;
  }

  // First route will always be a wildcard
  if (!parentRoute) {
    return `${currentRoute}*`;
  }

  const currentIsRootRoute = currentRoute === '/';
  const parentIsRootRoute = parentRoute === '/';

  // Only prefix non-root parent routes
  const routePrefix = (!parentIsRootRoute && parentRoute) || '';

  // Support "index" routes:
  // <Fragment forRoute='/home'>
  //   <Fragment forRoute='/'>
  //   </Fragment>
  // </Fragment>
  const routeSuffix =
    currentIsRootRoute && !parentIsRootRoute ? '' : currentRoute;

  const wildcard = currentIsRootRoute && parentIsRootRoute ? '' : '*';

  return `${routePrefix}${routeSuffix}${wildcard}`;
};

const shouldShowFragment = ({
  forRoute,
  withConditions,
  matcher,
  location
}) => {
  if (!forRoute) {
    return withConditions && withConditions(location);
  }

  const matchesRoute = matcher && matcher.match(location.pathname);

  return withConditions
    ? matchesRoute && withConditions(location)
    : matchesRoute;
};

type Props = {
  location: Location,
  matchRoute: Function,
  matchWildcardRoute: Function,
  forRoute?: string,
  parentRoute?: string,
  withConditions?: (location: Location) => boolean,
  forNoMatch?: boolean,
  parentId?: string,
  children: Node
};

export class FragmentComponent extends Component<*> {
  matcher: ?Object;

  constructor(props: Props) {
    super(props);

    const currentRoute = resolveCurrentRoute(props.parentRoute, props.forRoute);

    this.matcher = (currentRoute && new UrlPattern(currentRoute)) || null;
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.forRoute !== nextProps.forRoute) {
      throwError('Updating route props is not yet supported')();
    }

    // When Fragment rerenders, matchCache can get out of sync.
    // Blow it away at the root Fragment on every render.
    if (!this.props.parentId) {
      matchCache.clear();
    }
  }

  render() {
    const { matcher } = this;
    const {
      children,
      forRoute,
      withConditions,
      forNoMatch,
      location,
      parentRoute,
      parentId
    } = this.props;

    const shouldShow = shouldShowFragment({
      forRoute,
      withConditions,
      matcher,
      location
    });

    if (!shouldShow && !forNoMatch) {
      return null;
    }

    const currentRoute = resolveCurrentRoute(parentRoute, forRoute);

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

export const withIdAndContext = compose(
  getContext({
    parentRoute: PropTypes.string,
    parentId: PropTypes.string
  }),
  withId,
  withContext(
    {
      parentRoute: PropTypes.string,
      parentId: PropTypes.string
    },
    props => ({
      parentRoute: resolveChildRoute(props.parentRoute, props.forRoute),
      parentId: props.id
    })
  )
);

const mapStateToProps: MapStateToProps<*, *, *> = state => ({
  location: state.router
});

export default compose(connect(mapStateToProps), withIdAndContext)(
  FragmentComponent
);
