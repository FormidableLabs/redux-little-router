import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';

import {
  PUSH,
  REPLACE,
  GO,
  GO_BACK,
  GO_FORWARD,
  LOCATION_CHANGED
} from '../src/types';

import {
  push,
  replace,
  go,
  goBack,
  goForward,
  locationDidChange,
  initializeCurrentLocation
} from '../src/actions';

chai.use(sinonChai);

describe('Action creators', () => {
  it('creates a PUSH action', () => {
    const descriptor = {
      pathname: '/boop',
      query: {
        the: 'snoot'
      }
    };

    expect(push(descriptor)).to.deep.equal({
      type: PUSH,
      payload: {
        pathname: '/boop',
        state: {
          reduxLittleRouter: {
            options: {},
            query: {
              the: 'snoot'
            }
          }
        }
      }
    });
  });

  it('creates a REPLACE action', () => {
    const descriptor = {
      pathname: '/boop',
      query: {
        the: 'snoot'
      }
    };

    expect(replace(descriptor)).to.deep.equal({
      type: REPLACE,
      payload: {
        pathname: '/boop',
        state: {
          reduxLittleRouter: {
            options: {},
            query: {
              the: 'snoot'
            }
          }
        }
      }
    });
  });

  it('creates a GO action', () => {
    expect(go(1)).to.deep.equal({ type: GO, payload: 1 });
  });

  it('creates a GO_BACK action', () => {
    expect(goBack()).to.deep.equal({ type: GO_BACK });
  });

  it('creates a GO_FORWARD action', () => {
    expect(goForward()).to.deep.equal({ type: GO_FORWARD });
  });

  it('combines the location descriptor and the route match into a LOCATION_CHANGED action', () => {
    const locationChangedAction = locationDidChange({
      action: 'PUSH',
      basename: '/test',
      pathname: '/things',
      query: {
        test: 'ing'
      },
      params: {
        fakeParam: 'things'
      },
      result: {
        title: 'things'
      }
    });

    expect(locationChangedAction).to.deep.equal({
      type: LOCATION_CHANGED,
      payload: {
        action: 'PUSH',
        basename: '/test',
        pathname: '/things',
        query: {
          test: 'ing'
        },
        params: {
          fakeParam: 'things'
        },
        result: {
          title: 'things'
        }
      }
    });
  });

  it('creates a LOCATION_CHANGED action for an existing location/match result combo', () => {
    const expectedLocation = {
      action: 'PUSH',
      basename: '/test',
      pathname: '/things',
      query: {
        test: 'ing'
      },
      params: {
        fakeParam: 'things'
      },
      result: {
        title: 'things'
      }
    };
    const initialLocationAction = initializeCurrentLocation(expectedLocation);
    expect(initialLocationAction).to.deep.equal({
      type: LOCATION_CHANGED,
      payload: expectedLocation
    });
  });
});
