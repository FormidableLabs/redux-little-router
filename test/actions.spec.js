import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';

import {
  LOCATION_CHANGED,
  locationDidChange,
  initializeCurrentLocation
} from '../src/actions';

chai.use(sinonChai);

describe('Action creators', () => {
  it('combines the location descriptor and the route match into a LOCATION_CHANGED action', () => {
    const locationChangedAction = locationDidChange({
      location: {
        action: 'PUSH',
        basename: '/test',
        pathname: '/things',
        query: {
          test: 'ing'
        }
      },
      matchRoute: sandbox.stub().returns({
        params: {
          fakeParam: 'things'
        },
        result: {
          title: 'things'
        }
      })
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
