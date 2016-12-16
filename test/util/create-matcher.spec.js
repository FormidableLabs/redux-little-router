import { expect } from 'chai';
import createMatcher from '../../src/util/create-matcher';

import routes from '../test-util/fixtures/routes';
describe('createMatcher', () => {
  it('matches URLs and returns both their params and their value in the route hash', () => {
    const matchRoute = createMatcher(routes);

    expect(matchRoute('/home')).to.deep.equal({
      route: '/home',
      params: {},
      result: {
        name: 'home'
      }
    });

    expect(matchRoute('/home/messages')).to.deep.equal({
      route: '/home/messages',
      params: {},
      result: {
        name: 'messages'
      }
    });

    expect(matchRoute('/home/messages/a-team')).to.deep.equal({
      route: '/home/messages/:team',
      params: {
        team: 'a-team'
      },
      result: {
        name: 'team'
      }
    });

    expect(matchRoute('/home/messages/a-team/the-wat-channel')).to.deep.equal({
      route: '/home/messages/:team/:channel',
      params: {
        team: 'a-team',
        channel: 'the-wat-channel'
      },
      result: {
        name: 'channel'
      }
    });

    expect(matchRoute('/home/doot')).to.deep.equal({
      route: '/home/:spookyparam',
      params: {
        spookyparam: 'doot'
      },
      result: {
        name: '3spooky5me'
      }
    });
  });
});
