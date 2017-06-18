// @flow
import type { Href, Location } from '../types';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  push as pushAction,
  replace as replaceAction
} from '../actions';
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
  style: Object,
  location: Location,
  push: Function,
  replace: Function
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
  push,
  replace
}) => {
  if (onClick) {
    onClick(e);
  }

  if (shouldIgnoreClick({ e, target })) {
    return;
  }

  e.preventDefault();

  const navigate = replaceState ? replace : push;
  navigate(href, { persistQuery });
};

const Link = (props: Props) => {
  const {
    href: rawHref,
    location: { basename },
    children,
    onClick,
    target,
    replaceState,
    persistQuery,
    push,
    replace,
    ...rest
  } = props;

  // Ensure the href has both a search and a query when needed
  const href = normalizeHref(rawHref);

  const clickHandler = e => handleClick({
    e,
    target,
    href,
    onClick,
    replaceState,
    persistQuery,
    push,
    replace
  });

  return (
    <a
      href={stringifyHref(href, basename)}
      onClick={clickHandler}
      target={target}
      {...rest}
    >
      {children}
    </a>
  );
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

const mapStateToProps = state => ({ location: state.router });
const mapDispatchToProps = {
  push: pushAction,
  replace: replaceAction
};
const withLocation = connect(mapStateToProps, mapDispatchToProps);

const LinkWithLocation = withLocation(Link);
const PersistentQueryLinkWithLocation = withLocation(PersistentQueryLink);

export {
  LinkWithLocation as Link,
  PersistentQueryLinkWithLocation as PersistentQueryLink
};
