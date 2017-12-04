// @flow
import { connect } from 'react-redux';

import propsToJS from './props-to-js';

import {
  LinkComponent,
  PersistentQueryLinkComponent,
  mapDispatchToProps
} from '../../components/link';

const mapStateToProps = state => ({ location: state.get('router') });
const withLocation = connect(mapStateToProps, mapDispatchToProps);

const Link = withLocation(propsToJS(LinkComponent));
const PersistentQueryLink = withLocation(propsToJS(PersistentQueryLinkComponent));

export {
  Link,
  PersistentQueryLink
};
