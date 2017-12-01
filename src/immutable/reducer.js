// @flow
import { createReducer } from '../reducer';

import { get, push, merge, length, shift, omit, toJS } from './util/data';

export default createReducer({ get, push, merge, length, shift, omit, toJS });
