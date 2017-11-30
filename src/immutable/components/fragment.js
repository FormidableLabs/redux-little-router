import { connect } from 'react-redux';
import { compose } from 'recompose';

import { Fragment, withIdAndContext } from '../../components/fragment';

export default compose(
  connect(state => ({
    location: state.get('router')
  })),
  withIdAndContext
)(Fragment);
