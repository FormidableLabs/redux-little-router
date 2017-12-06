// @flow
import React from 'react';
import { Iterable } from 'immutable';

export default WrappedComponent =>
  wrappedProps => {
    const propsJS = Object.keys(wrappedProps).reduce((props, key) => ({
      ...props,
      [key]: Iterable.isIterable(wrappedProps[key]) ? wrappedProps[key].toJS() : wrappedProps[key]
    }), {});

    return (<WrappedComponent {...propsJS} />);
  };
