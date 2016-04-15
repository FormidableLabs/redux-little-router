export default class MockHistory {
  constructor() {
    this.callback = null;
  }

  listen(callback) {
    this.callback = callback;
  }

  push() {
    this.callback({
      pathname: '/push'
    });
  }

  replace() {
    this.callback({
      pathname: '/replace'
    });
  }

  go() {
    this.callback({
      pathname: '/go'
    });
  }

  goBack() {
    this.callback({
      pathname: '/goBack'
    });
  }

  goForward() {
    this.callback({
      pathname: '/goForward'
    });
  }
}
