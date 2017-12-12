// @flow
import throwError from './throw-error';

export const README_MESSAGE = `
  See the README for more information:
  https://github.com/FormidableLabs/redux-little-router#wiring-up-the-boilerplate
`;

export default (routes: Object) => {
  if (!routes) {
    throwError(`
      Missing route configuration. You must define your routes as
      an object where the keys are routes and the values are any
      route-specific data.

      ${README_MESSAGE}
    `)();
  }

  // eslint-disable-next-line no-magic-numbers
  if (!Object.keys(routes).every(route => route.indexOf('/') === 0)) {
    throwError(`
      The route configuration you provided is malformed. Make sure
      that all of your routes start with a slash.

      ${README_MESSAGE}
    `)();
  }
};
