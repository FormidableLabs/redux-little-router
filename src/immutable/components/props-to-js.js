// @flow
import type { Component } from 'react';

import React from 'react';
import { isImmutable } from '../util/immutable';

type Props = {
  [key: string]: any
};

export default (WrappedComponent: Class<Component<*, *, *>>) =>
  (wrappedProps: Props) => {
    const propsJS = Object.keys(wrappedProps).reduce((props, key) => ({
      ...props,
      [key]: isImmutable(wrappedProps[key]) ? wrappedProps[key].toJS() : wrappedProps[key]
    }), {});

    return (<WrappedComponent {...propsJS} />);
  };
