// @flow
import UrlPattern from 'url-pattern';

type RouteCache = {
  route: string,
  pattern: UrlPattern,
  result: Object
};

const find = (list, predicate) => {
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    if (predicate(item)) {
      return item;
    }
  }
  return null;
};

const wildcardMatcher = (routeList: Array<RouteCache>) =>
  (incomingUrl: string, routeToMatch: string = '') => {
    // Discard query strings
    const pathname = incomingUrl.split('?')[0];

    const storedRoute = find(routeList, route =>
      route.route === routeToMatch
    );

    if (!storedRoute) { return null; }

    const match = storedRoute.pattern.match(pathname);

    if (match) {
      return {
        route: storedRoute.route,
        params: match,
        result: storedRoute.result
      };
    }

    return null;
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

export default (routes: Object, wildcard: bool = false) => {
  const routeList = Object.keys(routes)
    .sort().reverse().map(route => ({
      route,
      pattern: new UrlPattern(
        // Prepend with wildcards if requested
        `${route}${wildcard && '*' || ''}`
      ),
      result: routes[route]
    }));

  return wildcard
    ? wildcardMatcher(routeList)
    : eagerMatcher(routeList);
};
