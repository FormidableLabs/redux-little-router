// @flow
import type { Store } from 'redux';

import React, { Component, PropTypes } from 'react';

export type RouterContext = { store: Store };

type Props = {
  store: Object,
  children: ReactPropTypes.node
};

export class RouterProvider extends Component {
  router: { store: Store };

  constructor(props: Props) {
    super(props);
    this.router = {
      store: props.store
    };
  }

  getChildContext() {
    return {
      router: this.router
    };
  }

  render() {
    return this.props.children;
  }
}

RouterProvider.childContextTypes = {
  router: PropTypes.object
};

type ProvideRouterArgs = {
  store: Object
};

export default ({ store }: ProvideRouterArgs) =>
  (ComposedComponent: ReactClass<*>) => (props: Object) =>
    <RouterProvider store={store}>
      <ComposedComponent {...props} />
    </RouterProvider>;
