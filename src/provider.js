import React, { Component, PropTypes } from 'react';

export class RouterProvider extends Component {
  constructor(props) {
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

RouterProvider.propTypes = {
  children: PropTypes.node,
  store: PropTypes.object
};

export default ({ store }) => ComposedComponent => props =>
  <RouterProvider store={store}>
    <ComposedComponent {...props} />
  </RouterProvider>;
