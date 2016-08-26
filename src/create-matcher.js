// @flow
import UrlPattern from 'url-pattern';



export default (routes: Object) => {
  // const routeList = Object.keys(routes).map(route => ({
  //   route,
  //   pattern: new UrlPattern(route),
  //   result: routes[route]
  // }));


  // build the route list, but do it recursively
  // const routeList = new Map();
  // const traverseRoutes = (route, parentPath) => {
  //   const path = `${parentPath}/${route.route}`;
  //   const children = route.children;
  //   routeList.set(path, route);
  //   if (children) {
  //     for (const child of children) {
  //       traverseRoutes(child, path);
  //     }
  //   }
  // };



  return (incomingUrl: string) => {

    // Discard query strings
    const route = incomingUrl.split('?')[0]; // eslint-disable-line no-magic-numbers

    const traverseRoutes = (toMatch, routeComponent, parentPath='') => {
      const path = parentPath === '/' ? `/${routeComponent.route}` : `${parentPath}/${routeComponent.route || ''}`;
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
    };

    // Returns an array where the final index contains an object containing
    // the route, matched params and the routeComponents. All other indicies
    // contain just the routeComponents
    const matchedRoute = traverseRoutes(route, routes);

    if (!matchedRoute) {
      return null;
    }

    const finalRouteComponent = matchedRoute[matchedRoute.length-1];
    return {
      route: finalRouteComponent.route,
      result: (matchedRoute.slice(0,-1).concat(finalRouteComponent.routeComponent)).map(r => {
        const childlessR = Object.assign({}, r);
        delete childlessR.children;
        return childlessR
      }),
      params: finalRouteComponent.params
    };

    // Currently Output:
    // {
    //   route: The route which has actually been matched,
    //   params: Any parameters (or empy object) that have been matched,
    //   results: The extra information from the route details
    // }
    // TODO Output the following:
    // {
    //   route: The route which has actually been matched,
    //   params: Any parameters (or empty object) that have been matched,
    //   result: The tree components involved in this route
    // }

    // // Find the route that matches the URL
    // for (let i = 0; i < routeList.length; i++) {
    //   const storedRoute = routeList[i];
    //   const match = storedRoute.pattern.match(route);
    //
    //   if (match) {
    //     // Return the matched params and user-defined result object
    //     return {
    //       route: storedRoute.route,
    //       params: match,
    //       result: storedRoute.result
    //     };
    //   }
    // }
    //
    // return null;
  };
};
