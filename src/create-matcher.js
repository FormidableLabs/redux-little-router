// @flow
import UrlPattern from 'url-pattern';
import { join as pathJoin } from 'path';

export default (routes: Object) => {

  return (incomingUrl: string) => {

    // Discard query strings
    const route = incomingUrl.split('?')[0]; // eslint-disable-line no-magic-numbers

    const traverseRoutes = (toMatch, routeComponent, parentPath='') => {

      if (routeComponent.routeComponent) {
        const path = pathJoin(parentPath, routeComponent.routeComponent);
        const pattern = new UrlPattern(path);
        const match = pattern.match(toMatch);
        if (match) {
          return [{
            route: path,
            params: match,
            routeComponent
          }];
        }

        const children = routeComponent.children;
        if (children) {
          for (const child of children) {
            const result = traverseRoutes(toMatch, child, path);
            if (result) {
              return [routeComponent].concat(result)
            }
          }
        }
      }
    };

    // Returns an array where the final index contains an object containing
    // the route, matched params and the routeComponents. All other indicies
    // contain just the routeComponents
    const matchedRoute = traverseRoutes(route, routes);

    if (!matchedRoute) {
      return null;
    }

    const finalRouteComponent = matchedRoute[matchedRoute.length-1];

    // Return:
    // {
    //   route: The route which has actually been matched,
    //   params: Any parameters (or empty object) that have been matched,
    //   result: The tree components involved in this route
    // }

    return {
      route: finalRouteComponent.route,
      result: (matchedRoute.slice(0,-1).concat(finalRouteComponent.routeComponent)).map(r => {
        const childlessR = Object.assign({}, r);
        delete childlessR.children;
        return childlessR
      }),
      params: finalRouteComponent.params
    };

  };
};
