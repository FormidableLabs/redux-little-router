// @flow
import type { LocationDescriptor } from 'history';
import type { RouterContext } from './provider';
import React, { Component, PropTypes } from 'react';

import { PUSH, REPLACE } from './action-types';

type Props = {
  children: React.Element<*>,
  className: string,
  href: string | LocationDescriptor,
  onClick: EventHandler,
  persistQuery: bool,
  replaceState: bool,
  style: Object,
  target: string
};

const LEFT_MOUSE_BUTTON = 0;

const normalizeHref = ({ basename, pathname, search }) =>
  `${basename || ''}${pathname}${search || ''}`;

const normalizeLocation = href => {
  if (typeof href === 'string') {
    const pathnameAndQuery = href.split('?');
    const pathname = pathnameAndQuery[0]; // eslint-disable-line no-magic-numbers
    const query = pathnameAndQuery[1]; // eslint-disable-line no-magic-numbers
    return query ? { pathname, search: `?${query}` } : { pathname };
  }
  return href;
};

const resolveQueryForLocation = ({
  linkLocation,
  persistQuery,
  currentLocation
}) => {
  const currentQuery = currentLocation &&
    currentLocation.query;

  // Only use the query from state if it exists
  // and the href doesn't provide its own query
  if (
    persistQuery &&
    currentQuery &&
    !linkLocation.search &&
    !linkLocation.query
  ) {
    return {
      pathname: linkLocation.pathname,
      query: currentQuery
    };
  }

  return linkLocation;
};

const isNotLeftClick = e => e.button && e.button !== LEFT_MOUSE_BUTTON;
const hasModifier = e =>
  Boolean(e.shiftKey || e.altKey || e.metaKey || e.ctrlKey);

const handleClick = ({
  e,
  target,
  location,
  replaceState,
  router,
  onClick
}) => {
  if (onClick) { onClick(e); }

  if (hasModifier(e) || isNotLeftClick(e)) { return; }

  if (e.defaultPrevented) { return; }

  // If target prop is set (e.g. to "_blank"), let browser handle link.
  if (target) { return; }

  e.preventDefault();

  if (router) {
    router.store.dispatch({
      type: replaceState ? REPLACE : PUSH,
      payload: location
    });
  }
};

const Link = (
  props: Props,
  context: {
    router: RouterContext
  }
) => {
  const {
    children,
    href,
    onClick,
    persistQuery,
    replaceState,
    target,
    ...rest
  } = props;

  const { router } = context;

  const locationDescriptor =
    resolveQueryForLocation({
      linkLocation: normalizeLocation(href),
      currentLocation: router.store.getState().router,
      persistQuery
    });

  const location = router.store.history
    .createLocation(locationDescriptor);


  return (
    <a
      href={normalizeHref(location)}
      onClick={e => handleClick({
        e,
        location,
        onClick,
        replaceState,
        router,
        target
      })}
      {...rest}
    >
      {children}
    </a>
  );
};

Link.contextTypes = {
  router: PropTypes.object
};

const PersistentQueryLink = class extends Component {
  render() {
    const { children, ...rest } = this.props;
    return <Link {...rest} persistQuery>{children}</Link>;
  }
};

PersistentQueryLink.propTypes = {
  children: PropTypes.node
};

PersistentQueryLink.contextTypes = {
  router: PropTypes.object
};

export { Link, PersistentQueryLink };
