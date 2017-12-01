import get from 'lodash.get';

// Using a utility to keep the api consistent.
// Accepts an array or string for `key`.
export default (obj, key, defaultValue) => get(obj, key, defaultValue);
