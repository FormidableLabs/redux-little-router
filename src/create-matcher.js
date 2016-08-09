import UrlPattern from 'url-pattern';

export default routes => {
  const routeDictionary = Object.keys(routes).map(route => ({
    route,
    pattern: new UrlPattern(route),
    result: routes[route]
  }));

  return incomingUrl => {
    // Discard query strings
    const route = incomingUrl.split('?')[0]; // eslint-disable-line no-magic-numbers

    // Find the route that matches the URL
    for (const key in routeDictionary) {
      if (routeDictionary.hasOwnProperty(key)) {
        const storedRoute = routeDictionary[key];
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
    }

    return null;
  };
};
