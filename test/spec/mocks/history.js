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
      action: 'PUSH',
      state: {
        bork: 'bork'
      }
    });
  }

  replace() {
    this.callback({
      pathname: '/replace',
      action: 'REPLACE',
      state: {
        bork: 'bork'
      }
    });
  }

  go() {
    this.callback({
      pathname: '/go',
      action: 'REPLACE',
      state: {
        bork: 'bork'
      }
    });
  }

  goBack() {
    this.callback({
      pathname: '/goBack',
      action: 'POP',
      state: {
        bork: 'bork'
      }
    });
  }

  goForward() {
    this.callback({
      pathname: '/goForward',
      action: 'PUSH',
      state: {
        bork: 'bork'
      }
    });
  }
}
