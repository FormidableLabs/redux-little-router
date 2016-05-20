import UrlPattern from 'url-pattern';
import find from 'lodash.find';

export default routes => {
  const routeCache = Object.keys(routes).map(key => ({
    pattern: new UrlPattern(key),
    result: routes[key]
  }));

  return incomingRoute => {
    const questionMarkIdx = incomingRoute.indexOf('?');
    const preQueryRoute = questionMarkIdx === -1 ? // eslint-disable-line no-magic-numbers
      incomingRoute :
      incomingRoute.slice(0, questionMarkIdx); // eslint-disable-line no-magic-numbers

    const match = find(routeCache, route =>
      route.pattern.match(preQueryRoute)
    ) || null;

    return match ? {
      params: match.pattern.match(preQueryRoute),
      result: match.result
    } : null;
  };
};
