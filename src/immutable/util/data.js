// @flow
import { Iterable, fromJS } from 'immutable';

const convertToImmutable = (obj) => Iterable.isIterable(obj) ? obj : fromJS(obj);

const get = (obj, key, defaultValue) => {
  const immutableObj = convertToImmutable(obj);
  const immutableDefault = convertToImmutable(defaultValue);
  return Array.isArray(key) ?
    immutableObj.getIn(key, immutableDefault) :
    immutableObj.get(key, immutableDefault);
};

const merge = (obj1, obj2 = {}) => convertToImmutable(obj1).merge(convertToImmutable(obj2));
const push = (arr, value) => convertToImmutable(arr).push(convertToImmutable(value));
const length = (arr) => convertToImmutable(arr).size;
const shift = (arr) => convertToImmutable(arr).shift();

const omit = (obj, key) => convertToImmutable(obj).withMutations(obj => {
  if (Array.isArray(key)) {
    key.forEach(key => obj.delete(key));
  } else {
    obj.delete(key);
  }
});

export {
  get,
  merge,
  push,
  length,
  shift,
  omit
};
