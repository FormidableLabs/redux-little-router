// @flow
import type { Store } from 'redux';

import React, {
  Component,
  PropTypes,
  cloneElement
} from 'react';

import { connect } from 'react-redux';

export type StoreWithRouter<S, A> = Store<S, A> & {
  routes: Object
};

export type RouterContext = { store: Store<*, *> };

type Props = {
  store: StoreWithRouter<*, *>,
  children: React.Element<*>
};

class RouterProviderImpl extends Component {
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

  router: { store: StoreWithRouter<*, *> };

  render() {
    const { store } = this.router;
    const routerState = store.getState().router;

    // Ensure that the router props from connect()
    // actually get to the child component(s)
    return cloneElement(this.props.children, {
      router: {
        ...routerState,

        // This is a hack to allow routes to define
        // unserializable things like components
        result: store.routes[routerState.route]
      }
    });
  }
}

RouterProviderImpl.childContextTypes = {
  router: PropTypes.object
};

type ProvideRouterArgs = {
  store: StoreWithRouter<*, *>
};

export const RouterProvider = connect(state => ({
  router: state.router
}))(RouterProviderImpl);

export default ({ store }: ProvideRouterArgs) =>
  (ComposedComponent: ReactClass<*>) => (props: Object) =>
    <RouterProvider store={store}>
      <ComposedComponent {...props} />
    </RouterProvider>;
