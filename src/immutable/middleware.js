// @flow
import { createMiddleware } from '../middleware';

import { get } from './util/data';

export default createMiddleware(get);
