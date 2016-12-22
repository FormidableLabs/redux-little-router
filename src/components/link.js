// @flow
import type { Href } from '../types';
import type { RouterContext } from './provider';

import React, { Component, PropTypes } from 'react';

import { push, replace } from '../actions';
import normalizeHref from '../util/normalize-href';
import stringifyHref from '../util/stringify-href';

type Props = {
  children: React.Element<*>,
  className: string,
  href: Href,
  persistQuery: bool,
  replaceState: bool,
  target: string,
  onClick: EventHandler,
  style: Object
};

const LEFT_MOUSE_BUTTON = 0;

const isNotLeftClick = e =>
  e.button && e.button !== LEFT_MOUSE_BUTTON;

const hasModifier = e =>
  Boolean(e.shiftKey || e.altKey || e.metaKey || e.ctrlKey);

const shouldIgnoreClick = ({ e, target }) =>
  hasModifier(e) ||
  isNotLeftClick(e) ||
  e.defaultPrevented ||
  target; // let browser handle target="_blank"

const handleClick = ({
  e,
  target,
  href,
  onClick,
  replaceState,
  persistQuery,
  store
}) => {
  if (onClick) {
    onClick(e);
  }

  if (shouldIgnoreClick({ e, target })) {
    return;
  }

  e.preventDefault();

  const navigate = replaceState ? replace : push;
  store.dispatch(navigate(href, { persistQuery }));
};

const Link = (
  props: Props,
  context: {
    router: RouterContext
  }
) => {
  const {
    href: rawHref,
    children,
    onClick,
    target,
    replaceState,
    persistQuery,
    ...rest
  } = props;

  const { store } = context.router;
  const { router: { basename } } = store.getState();

  // Ensure the href has both a search and a query when needed
  const href = normalizeHref(rawHref);

  const clickHandler = e => handleClick({
    e,
    target,
    href,
    onClick,
    replaceState,
    persistQuery,
    store
  });

  return (
    <a
      href={stringifyHref(href, basename)}
      onClick={clickHandler}
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
