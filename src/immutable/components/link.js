// @flow
import { connect } from 'react-redux';

import propsToJS from './props-to-js';

import { _Link, _PersistentQueryLink, mapDispatchToProps } from '../../components/link';

const mapStateToProps = state => ({ location: state.get('router') });
const withLocation = connect(mapStateToProps, mapDispatchToProps);

const Link = withLocation(propsToJS(_Link));
const PersistentQueryLink = withLocation(propsToJS(_PersistentQueryLink));

export {
  Link,
  PersistentQueryLink
};
