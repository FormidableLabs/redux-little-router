// Needs to be the same API as `src/util/get`.
export default (obj, key, defaultValue) => 
  Array.isArray(key) ? obj.getIn(key, defaultValue) : obj.get(key, defaultValue);
