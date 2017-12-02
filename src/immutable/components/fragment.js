// @flow
import { connect } from 'react-redux';
import { compose } from 'recompose';

import propsToJS from './props-to-js';

import { _Fragment, withIdAndContext } from '../../components/fragment';

export default compose(
  connect(state => ({
    location: state.get('router')
  })),
  withIdAndContext,
  propsToJS
)(_Fragment);
