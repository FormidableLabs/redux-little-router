export default class MockHistory {
  constructor() {
    this.callback = null;
  }

  listen(callback) {
    this.callback = callback;
  }

  push() {
    this.callback({
      pathname: '/push',
      action: 'PUSH'
    });
  }

  replace() {
    this.callback({
      pathname: '/replace',
      action: 'REPLACE'
    });
  }

  go() {
    this.callback({
      pathname: '/go',
      action: 'REPLACE'
    });
  }

  goBack() {
    this.callback({
      pathname: '/goBack',
      action: 'POP'
    });
  }

  goForward() {
    this.callback({
      pathname: '/goForward',
      action: 'PUSH'
    });
  }
}
