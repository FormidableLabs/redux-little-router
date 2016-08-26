// @flow
import type { Store } from 'redux';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

export type RouterContext = { store: Store };

type Props = {
  store: Object,
  children: ReactPropTypes.node
};

class RouterProviderImpl extends Component {
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

RouterProviderImpl.childContextTypes = {
  router: PropTypes.object
};

type ProvideRouterArgs = {
  store: Object
};

export const RouterProvider = connect(state => ({
  router: state.router
}))(RouterProviderImpl);

export default ({ store }: ProvideRouterArgs) =>
  (ComposedComponent: ReactClass<*>) => (props: Object) =>
    <RouterProvider store={store}>
      <ComposedComponent {...props} />
    </RouterProvider>;
