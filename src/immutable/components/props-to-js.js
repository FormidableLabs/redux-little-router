// @flow
import type { Component } from 'react';

import React from 'react';
import { isImmutable } from '../util/immutable';

export default <P: Object>(WrappedComponent: Class<Component<*>>) => (
  wrappedProps: P
) => {
  const propsJS = Object.keys(wrappedProps).reduce(
    (props, key) => ({
      ...props,
      [key]: isImmutable(wrappedProps[key])
        ? wrappedProps[key].toJS()
        : wrappedProps[key]
    }),
    {}
  );

  return <WrappedComponent {...propsJS} />;
};
