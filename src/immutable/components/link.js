import { connect } from 'react-redux';

import { push as pushAction, replace as replaceAction } from '../../actions';
import { _Link, _PersistentQueryLink } from '../../components/link';

const mapStateToProps = state => ({ location: state.get('router') });
const mapDispatchToProps = {
  push: pushAction,
  replace: replaceAction
};
const withLocation = connect(mapStateToProps, mapDispatchToProps);

const LinkWithLocation = withLocation(_Link);
const PersistentQueryLinkWithLocation = withLocation(_PersistentQueryLink);

export {
  LinkWithLocation as Link,
  PersistentQueryLinkWithLocation as PersistentQueryLink
};
