// @flow
import { createMiddleware } from '../middleware';

import { get, toJS } from './util/data';

export default createMiddleware(get, toJS);
