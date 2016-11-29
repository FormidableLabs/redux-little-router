import qs from 'query-string';
import { createLocation } from 'history/LocationUtils';

// eslint-disable-next-line max-params
export default (path, state, key, currentLocation) => {
  const vanillaLocation = createLocation(path, state, key, currentLocation);

  const { query, basename } = path;
  const { search } = vanillaLocation;

  const resolvedSearch = search ||
    (query && Object.keys(query).length && `?${qs.stringify(query)}`) || '';
  const resolvedQuery = query || qs.parse(search);

  const location = {
    ...vanillaLocation,
    search: resolvedSearch,
    query: resolvedQuery
  };

  return basename ? { ...location, basename } : location;
};
