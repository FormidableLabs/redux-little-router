// @flow
import type { Node } from 'react';
import type { Href, Location } from '../types';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { push as pushAction, replace as replaceAction } from '../actions';
import mergeQueries from '../util/merge-queries';
import normalizeHref from '../util/normalize-href';
import stringifyHref from '../util/stringify-href';

type Props = {
  children: Node,
  className: string,
  href: Href,
  persistQuery: boolean,
  replaceState: boolean,
  target: string,
  onClick: EventHandler,
  style: Object,
  location: Location,
  push: typeof pushAction,
  replace: typeof replaceAction,
  // TODO: replace with recursive Props definition
  // https://github.com/yannickcr/eslint-plugin-react/issues/913
  activeProps: Object
};

const LEFT_MOUSE_BUTTON = 0;

const isNotLeftClick = e => e.button && e.button !== LEFT_MOUSE_BUTTON;

const hasModifier = e =>
  Boolean(e.shiftKey || e.altKey || e.metaKey || e.ctrlKey);

const shouldIgnoreClick = ({ e, target }) =>
  hasModifier(e) || isNotLeftClick(e) || e.defaultPrevented || target;

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

// When persisting queries, we need to merge the persisted
// query with the link's new query.
const contextifyHref = (href, location, persistQuery) => {
  if (!persistQuery) {
    return href;
  }

  const mergedQuery = mergeQueries(location.query, href.query);

  return {
    ...href,
    ...mergedQuery
  };
};

class LinkComponent extends Component<*> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const {
      href: rawHref,
      location,
      children,
      onClick,
      target,
      activeProps,
      replaceState,
      persistQuery,
      push,
      replace,
      ...rest
    } = this.props;

    // Ensure the href has both a search and a query when needed
    const normalizedHref = normalizeHref(rawHref);
    const href = contextifyHref(normalizedHref, location, persistQuery);
    const isActive = href.pathname === location.pathname;
    const activeRest = (isActive && activeProps) || {};

    const clickHandler = e =>
      handleClick({
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
        href={stringifyHref(href, location.basename)}
        onClick={clickHandler}
        target={target}
        {...rest}
        {...activeRest}
      >
        {children}
      </a>
    );
  }
}

const PersistentQueryLinkComponent = class extends Component<*> {
  render() {
    const { children, ...rest } = this.props;
    return (
      <LinkComponent {...rest} persistQuery>
        {children}
      </LinkComponent>
    );
  }
};

PersistentQueryLinkComponent.propTypes = {
  children: PropTypes.node
};

const mapStateToProps = state => ({ location: state.router });
const mapDispatchToProps = {
  push: pushAction,
  replace: replaceAction
};
const withLocation = connect(mapStateToProps, mapDispatchToProps);

const LinkWithLocation = withLocation(LinkComponent);
const PersistentQueryLinkWithLocation = withLocation(
  PersistentQueryLinkComponent
);

export {
  LinkWithLocation as Link,
  PersistentQueryLinkWithLocation as PersistentQueryLink,
  LinkComponent,
  PersistentQueryLinkComponent,
  mapDispatchToProps
};
