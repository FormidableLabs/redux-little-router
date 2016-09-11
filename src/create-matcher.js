// @flow
import UrlPattern from 'url-pattern';

export default (routes: Object) => {
  const routeList = Object.keys(routes).map(route => ({
    route,
    pattern: new UrlPattern(route),
    result: routes[route]
  }));

  return (incomingUrl: string) => {
    // Discard query strings
    const route = incomingUrl.split('?')[0];

    // Find the route that matches the URL
    for (let i = 0; i < routeList.length; i++) {
      const storedRoute = routeList[i];
      const match = storedRoute.pattern.match(route);

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
};
