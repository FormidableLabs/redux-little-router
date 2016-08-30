// @flow
export function makeRoute(details, ...children) {
  return Object.assign({}, details, children ? { children } : {});
}
