import UrlPattern from 'url-pattern';

export default routes => {
  const routeCache = Object.keys(routes).map(key => ({
    pattern: new UrlPattern(key),
    result: routes[key]
  }));

  return incomingRoute => {
    const match = routeCache.find(
      route => route.pattern.match(incomingRoute)
    );
    return {
      params: match.pattern.match(incomingRoute),
      result: match.result
    };
  };
};
