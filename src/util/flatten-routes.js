// @flow
import assign from 'lodash.assign';

const filterObject = (target, predicate) =>
  Object.keys(target).reduce((acc, key) => {
    return predicate(key) ? { ...acc, [key]: target[key] } : acc;
  }, {});

const mapObject = (target, transformKey, transformValue) =>
  Object.keys(target).reduce((acc, key) => {
    const newKey = transformKey ? transformKey(key) : key;
    const newValue = transformValue ? transformValue(target[key]) : target[key];
    return { ...acc, [newKey]: newValue };
  }, {});

const onlyRoutes = routes =>
  filterObject(routes, key => key.indexOf('/') === 0);

const withoutRoutes = routes =>
  filterObject(routes, key => key.indexOf('/') !== 0);

const flattenRoutes = (routes: Object, acc: Object = {}) => {
  Object.keys(routes).forEach(key => {
    const baseRoute = key === '/' ? '' : key;
    flattenRoutes(
      mapObject(
        onlyRoutes(routes[key]),
        routeKey => `${baseRoute}${routeKey}`,
        routeValue => ({
          ...routeValue,
          parent: {
            ...withoutRoutes(routes[key]),
            route: key
          }
        })
      ),
      acc
    );
  });

  assign(acc, mapObject(routes, null, withoutRoutes));

  return acc;
};

export default flattenRoutes;
