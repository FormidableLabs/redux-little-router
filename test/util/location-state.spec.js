import { expect } from 'chai';
import { packState, unpackState } from '../../src/util/location-state';

describe('locationState', () => {
  it('packs an href\'s given options and query into namespaced location state', () => {
    expect(packState({
      pathname: '/wat',
      query: { please: 'clap' }
    }, {
      persistQuery: true
    })).to.deep.equal({
      pathname: '/wat',
      state: {
        reduxLittleRouter: {
          query: { please: 'clap' },
          options: { persistQuery: true }
        }
      }
    });
  });

  it('creates a normal location from a state-packed one', () => {
    expect(unpackState({
      pathname: '/wat',
      state: {
        user: 'provided',
        reduxLittleRouter: {
          query: { please: 'clap' },
          options: { persistQuery: true }
        }
      }
    })).to.deep.equal({
      pathname: '/wat',
      query: { please: 'clap' },
      options: { persistQuery: true },
      state: {
        user: 'provided'
      }
    });
  });
});
