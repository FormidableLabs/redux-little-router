import { expect } from 'chai';
import validateRoutes, { README_MESSAGE } from '../../src/util/validate-routes';

describe('validateRoute', () => {
  it('throws an error if no routes object is passed in', () => {
    expect(validateRoutes).to.throw(`
      Missing route configuration. You must define your routes as
      an object where the keys are routes and the values are any
      route-specific data.

      ${README_MESSAGE}
    `);
  });

  it('throws an error if a route does not begin with a slash', () => {
    const routes = {
      '/': {},
      cat: {},
      '/dog': {}
    };
    expect(validateRoutes.bind(null, routes)).to.throw(`
      The route configuration you provided is malformed. Make sure
      that all of your routes start with a slash.

      ${README_MESSAGE}
    `);
  });
});
