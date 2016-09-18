// @flow
import type { Element } from 'react';
import { Children } from 'react';

const visitChildren = (children: Element<*>, visit: Function) => {
  if (Children.count(children) > 1) {
    Children.forEach(
      children,
      grandchildren => visitChildren(grandchildren, visit)
    );
    return;
  }

  if (!children || !children.props) {
    return;
  }

  visit(children);

  Children.forEach(
    children.props.children,
    grandchildren => visitChildren(grandchildren, visit)
  );
};

export default visitChildren;
