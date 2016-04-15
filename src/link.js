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
    const { href, history, children} = this.props;
    return (
      <a
        {...this.props}
        href={history ? history.createHref(href) : href}
        onClick={this.onClick.bind(this)}
      >
        {children}
      </a>
    );
  }
}

Link.propTypes = {
  href: PropTypes.string,
  children: PropTypes.node,
  dispatch: PropTypes.func,
  history: PropTypes.object
};
