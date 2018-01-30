// @flow
import type { Location, Query } from '../types';

import qs from 'query-string';

export default (oldQuery: ?Query, newQuery: ?Query): Location => {
  const mergedQuery = {
    ...oldQuery,
    ...newQuery
  };
  const search: string = `?${qs.stringify(mergedQuery)}`;

  return {
    query: mergedQuery,
    search
  };
};
