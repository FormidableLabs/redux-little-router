import visitChildren from './visit-children';

export default (children, forRoute) => {
  const routes = [forRoute];

  visitChildren(children, child => {
    if (child.props && child.props.forRoute) {
      routes.push(child.props.forRoute);
    }
  });

  return routes.map((route, index, routesArray) =>
    routesArray.slice(0, index + 1)
      .reduce((prev, curr) =>
        // ignore the root slash
        `${prev !== '/' ? prev : ''}${curr}`, ''
      )
  ).reverse();
};
