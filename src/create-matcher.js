import UrlPattern from 'url-pattern';
import find from 'lodash.find';

export default routes => {
  const routeCache = Object.keys(routes).map(key => ({
    pattern: new UrlPattern(key),
    result: routes[key]
  }));

  return incomingRoute => {
    const match = find(routeCache, route =>
      route.pattern.match(incomingRoute)
    ) || null;

    return match ? {
      params: match.pattern.match(incomingRoute),
      result: match.result
    } : null;
  };
};
