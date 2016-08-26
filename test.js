const UrlPattern = require('url-pattern');
const pathJoin = require('path').join;

const root = { routeComponent: '/', name:'root' };
const home = { routeComponent:'home', name:'home' };
const messages = { routeComponent:'messages', name:'messages' };
const team = { routeComponent:':team', name:'team' };
const channel = { routeComponent:':channel', name:'channel' };
const spookyparam = { routeComponent:':spookyparam', name:'3spooky5me' };

const routes = Object.assign(root, {
  children: [Object.assign(home, {
    children: [Object.assign(messages, {
      children: [Object.assign(team, {
        children: [Object.assign(channel, {})]
      })]
    }), Object.assign(spookyparam, {})]
  })]
});

const traverseRoutes = (toMatch, routeComponent, parentPath='') => {
  const path = pathJoin(parentPath, routeComponent.routeComponent);
  const pattern = new UrlPattern(path);
  const match = pattern.match(toMatch);
  if (match) {
    return [{
      route: path,
      params: match,
      routeComponent
    }];
  }

  const children = routeComponent.children;
  if (children) {
    for (const child of children) {
      const result = traverseRoutes(toMatch, child, path);
      if (result) {
        return [routeComponent].concat(result)
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
