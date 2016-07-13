import React, { Component, PropTypes } from 'react';

export default ({ store, history }) => ComposedComponent => {
  class RouterProvider extends Component {
    constructor(props) {
      super(props);
      this.router = { store, history };
    }

    getChildContext() {
      return {
        router: this.router
      };
    }

    render() {
      const { children, ...rest } = this.props; // eslint-disable-line no-unused-vars
      return <ComposedComponent {...rest} />;
    }
  }

  RouterProvider.childContextTypes = {
    router: PropTypes.object
  };

  RouterProvider.propTypes = {
    children: PropTypes.node
  };

  return RouterProvider;
};
