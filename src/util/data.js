// @flow
import _get from 'lodash.get';
import _assign from 'lodash.assign';
import _omit from 'lodash.omit';

const get = (obj, key, defaultValue) => _get(obj, key, defaultValue);
const merge = (obj1, obj2 = {}) => _assign({}, obj1, obj2);
const push = (arr, value) => arr.concat([value]);
const length = arr => arr.length;
const shift = arr => arr.slice(1);
const omit = (obj, key) => _omit(obj, key);
const toJS = obj => obj;

export {
  get,
  merge,
  push,
  length,
  shift,
  omit,
  toJS
};
