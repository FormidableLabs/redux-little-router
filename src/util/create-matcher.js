// @flow
import UrlPattern from 'url-pattern';

type RouteCache = {
  route: string,
  pattern: UrlPattern,
  result: Object
};

const eagerMatcher = (routeList: Array<RouteCache>) =>
  (incomingUrl: string) => {
  // Discard query strings
    const pathname = incomingUrl.split('?')[0];

    // Find the route that matches the URL
    for (let i = 0; i < routeList.length; i++) {
      const storedRoute = routeList[i];
      const match = storedRoute.pattern.match(pathname);

      if (match) {
        // Return the matched params and user-defined result object
        return {
          route: storedRoute.route,
          params: match,
          result: storedRoute.result
        };
      }
    }

    return null;
  };

export default (routes: Object) => {
  const routeList = Object.keys(routes)
    .sort().reverse().map(route => ({
      route,
      pattern: new UrlPattern(route),
      result: routes[route]
    }));

  return eagerMatcher(routeList);
};
