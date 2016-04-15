import React, { Component, PropTypes } from 'react';
import { PUSH } from './action-types';

export default class Link extends Component {
  onClick(event) {
    event.preventDefault();
    this.props.dispatch({
      type: PUSH,
      payload: {
        pathname: this.props.href
      }
    });
  }

  render() {
    return (
      <a
        {...this.props}
        href={this.props.href}
        onClick={this.onClick.bind(this)}
      >
        {this.props.children}
      </a>
    );
  }
}

Link.propTypes = {
  href: PropTypes.string,
  children: PropTypes.node,
  dispatch: PropTypes.func
};
