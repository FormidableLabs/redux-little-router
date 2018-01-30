// @flow
import { connect } from 'react-redux';

import {
  LinkComponent,
  PersistentQueryLinkComponent,
  mapDispatchToProps
} from '../../components/link';
import propsToJS from './props-to-js';

const mapStateToProps = state => ({ location: state.get('router') });

const withLocation = connect(mapStateToProps, mapDispatchToProps);

const LinkWithLocation = withLocation(propsToJS(LinkComponent));
const PersistentQueryLinkWithLocation = withLocation(
  propsToJS(PersistentQueryLinkComponent)
);

export {
  LinkWithLocation as ImmutableLink,
  PersistentQueryLinkWithLocation as ImmutablePersistentQueryLink
};
