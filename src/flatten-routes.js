const filterObject = (target, predicate) =>
  Object.keys(target).reduce((acc, key) => {
    return predicate(key)
      ? {...acc, [key]: target[key]}
      : acc;
  }, {});

const onlyRoutes = routes =>
  filterObject(routes, key => key.indexOf('/') === 0);

const withoutRoutes = routes =>
  filterObject(routes, key => key.indexOf('/') !== 0);

const mapKeys = (target, transform) =>
  Object.keys(target).reduce((acc, key) => ({
    ...acc, [transform(key)]: target[key]
  }), {});

const removeChildRoutes = childRoutes =>
  Object.keys(childRoutes).reduce((_acc, key) => ({
    ..._acc, [key]: withoutRoutes(childRoutes[key])
  }), {});

const flattenRoutes = (routes, parent, acc = {}) => {
  Object.keys(routes).forEach(key => {
    const baseRoute = key === '/' ? '' : key;
    flattenRoutes(
      mapKeys(
        onlyRoutes(routes[key]),
        route => `${baseRoute}${route}`
      ),
      routes,
      acc
    );
  });

  Object.assign(
    acc, parent, removeChildRoutes(routes)
  );

  return acc;
};

export default flattenRoutes;
