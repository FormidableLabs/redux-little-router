// @flow
/* eslint-disable import/no-mutable-exports, no-empty */
const throwError = (...args: Array<*>) => {
  const argsString = args.reduce((str, arg) => `${str} ${arg}`, '');
  throw new Error(
    `immutable.js was not imported. Make sure you have it installed. Was called with ${argsString}.`
  );
};

let immutable;
let Map = throwError;
let List = throwError;
let fromJS = throwError;
let isImmutable = throwError;

try {
  immutable = require('immutable');
  Map = immutable.Map;
  List = immutable.List;
  fromJS = immutable.fromJS;
  // To account for immutable versions 3.8.x -> 4.x.x
  isImmutable = immutable.isImmutable ? immutable.isImmutable : immutable.Iterable.isIterable;
} catch (e) {}

export {
  Map,
  List,
  fromJS,
  isImmutable
};

export default immutable;
