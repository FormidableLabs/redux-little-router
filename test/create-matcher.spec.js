import { expect } from 'chai';
import { createMatcher } from '../src';

const routes = {
  '/home': {
    name: 'home'
  },
  '/home/messages': {
    name: 'messages'
  },
  '/home/messages/:team': {
    name: 'team'
  },
  '/home/messages/:team/:channel': {
    name: 'channel'
  },
  '/home/:spookyparam': {
    name: '3spooky5me'
  }
};

describe('createMatcher', () => {
  it('matches URLs and returns both their params and their value in the route hash', () => {
    const matchRoute = createMatcher(routes);

    expect(matchRoute('/home')).to.deep.equal({
      params: {},
      result: {
        name: 'home'
      }
    });

    expect(matchRoute('/home/messages')).to.deep.equal({
      params: {},
      result: {
        name: 'messages'
      }
    });

    expect(matchRoute('/home/messages/a-team')).to.deep.equal({
      params: {
        team: 'a-team'
      },
      result: {
        name: 'team'
      }
    });

    expect(matchRoute('/home/messages/a-team/the-wat-channel')).to.deep.equal({
      params: {
        team: 'a-team',
        channel: 'the-wat-channel'
      },
      result: {
        name: 'channel'
      }
    });

    expect(matchRoute('/home/doot')).to.deep.equal({
      params: {
        spookyparam: 'doot'
      },
      result: {
        name: '3spooky5me'
      }
    });
  });
});
