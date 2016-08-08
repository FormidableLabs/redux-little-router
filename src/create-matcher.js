import UrlPattern from 'url-pattern';
import find from 'lodash.find';

export default routes => {
  const routeDictionary = Object.keys(routes).map(route => ({
    route,
    pattern: new UrlPattern(route),
    result: routes[route]
  }));

  return incomingUrl => {
    // Discard query strings
    const [route, , ] = incomingUrl.split('?');

    // Find the route that matches the URL
    const match = find(routeDictionary, storedRoute =>
      storedRoute.pattern.match(route)
    );

    // Return the matched params and user-defined result object
    return match ? {
      route: match.route,
      params: match.pattern.match(route),
      result: match.result
    } : null;
  };
};
