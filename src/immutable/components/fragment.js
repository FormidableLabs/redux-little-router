// @flow
import type { MapStateToProps } from 'react-redux';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { FragmentComponent, withIdAndContext } from '../../components/fragment';
import propsToJS from './props-to-js';

const mapStateToProps: MapStateToProps<*, *, *> = state => ({
  location: state.get('router')
});

// $FlowFixMe
export default compose(connect(mapStateToProps), withIdAndContext, propsToJS)(
  FragmentComponent
);
