export default class MockHistory {
  constructor() {
    this.callback = null;
  }

  listen(callback) {
    this.callback = callback;
  }

  push() {
    return this.callback && this.callback({
      pathname: '/push',
      action: 'PUSH',
      state: {
        bork: 'bork'
      }
    });
  }

  replace() {
    return this.callback && this.callback({
      pathname: '/replace',
      action: 'REPLACE',
      state: {
        bork: 'bork'
      }
    });
  }

  go() {
    return this.callback && this.callback({
      pathname: '/go',
      action: 'REPLACE',
      state: {
        bork: 'bork'
      }
    });
  }

  goBack() {
    return this.callback && this.callback({
      pathname: '/goBack',
      action: 'POP',
      state: {
        bork: 'bork'
      }
    });
  }

  goForward() {
    return this.callback && this.callback({
      pathname: '/goForward',
      action: 'PUSH',
      state: {
        bork: 'bork'
      }
    });
  }
}
