// @flow
/* eslint-disable import/no-mutable-exports, no-empty */
import throwError from '../../util/throw-error';

const throwImmutableError = throwError(
  'immutable.js was not imported. Make sure you have it installed.'
);

let immutable;
let Map = throwImmutableError;
let List = throwImmutableError;
let fromJS = throwImmutableError;
let isImmutable = throwImmutableError;

try {
  immutable = require('immutable');
  Map = immutable.Map;
  List = immutable.List;
  fromJS = immutable.fromJS;
  // To account for immutable versions 3.8.x -> 4.x.x
  isImmutable = immutable.isImmutable
    ? immutable.isImmutable
    : immutable.Iterable.isIterable;
} catch (e) {}

export { Map, List, fromJS, isImmutable };

export default immutable;
