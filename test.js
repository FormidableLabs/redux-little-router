const UrlPattern = require('url-pattern');

const root = { name:'root' };
const home = { route:'home', name:'home' };
const messages = { route:'messages', name:'home' };
const team = { route:':team', name:'team' };
const channel = { route:':channel', name:'channel' };
const spookyparam = { route:'spookyparam', name:'3spooky5me' };

const routes = Object.assign(root, {
  children: [Object.assign(home, {
    children: [Object.assign(messages, {
      children: [Object.assign(team, {
        children: [Object.assign(channel, {})]
      })]
    })]
  }), Object.assign(spookyparam, {})]
});

// Instead of building a flat route list, recursively match
const traverseRoutes = (toMatch, route, parentPath='') => {
  const path = parentPath === '/' ? `/${route.route}` : `${parentPath}/${route.route || ''}`;
  const pattern = new UrlPattern(path);

  if (pattern.match(toMatch)) {
    return route;
  }

  const children = route.children;
  if (children) {
    for (const child of children) {
      const result = traverseRoutes(toMatch, child, path);
      if (result) {
        return [route].concat(result)
      }
    }
  }
};

const x = traverseRoutes('/home/messages', routes);
console.log(x);

//
//
// // build the route list, but do it recursively
// const routeList = new Map();
// const traverseRoutes = (route, parentPath='') => {
//   const path = parentPath === '/' ? `/${route.route}` : `${parentPath}/${route.route || ''}`;
//   const pattern = new UrlPattern(path);
//   routeList.set(pattern, route);
//
//   const children = route.children;
//   if (children) {
//     for (const child of children) {
//       traverseRoutes(child, path);
//     }
//   }
// };
//
// traverseRoutes(routes)
//
// for (routeKey of routeList.keys()) {
//   // console.log(routeKey);
//   // const pattern = new UrlPattern(routeKey);
//   const match = routeKey.match('/home/messages');
//   if (match) {
//     const route = routeList.get(routeKey);
//     console.log(route);
//   }
//
// }
