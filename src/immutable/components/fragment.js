// @flow
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { FragmentComponent, withIdAndContext } from '../../components/fragment';
import propsToJS from './props-to-js';

export default compose(
  connect(state => ({
    location: state.get('router')
  })),
  withIdAndContext
)(propsToJS(FragmentComponent));
