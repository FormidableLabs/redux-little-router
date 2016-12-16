/* eslint-disable max-len, no-magic-numbers */
import { expect } from 'chai';
import { mount } from 'enzyme';

import React from 'react';

import { AbsoluteFragment, RelativeFragment } from '../../src/components/fragment';

import { fakeContext } from '../test-util';

describe('AbsoluteFragment', () => {
  it('renders if the current URL matches the given route', () => {
    const wrapper = mount(
      <AbsoluteFragment forRoute='/home/messages/:team'>
        <p>Hey, wait, I'm having one of those things...you know, a headache with pictures.</p>
      </AbsoluteFragment>,
      fakeContext({
        pathname: '/home/messages/a-team'
      })
    );
    expect(wrapper.find('p').node.textContent).to.equal(
      'Hey, wait, I\'m having one of those things...you know, a headache with pictures.'
    );
  });

  it('renders nothing if the current URL does not match the given route', () => {
    const wrapper = mount(
      <AbsoluteFragment forRoute='/home/messages/:team'>
        <p>Nothing to see here!</p>
      </AbsoluteFragment>,
      fakeContext({
        pathname: '/home'
      })
    );
    expect(wrapper.find('p')).to.have.lengthOf(0);
  });

  it('renders nothing if the current URL does not match any of the routes', () => {
    const wrapper = mount(
      <AbsoluteFragment forRoute='/home'>
        <p>Nothing to see here!</p>
      </AbsoluteFragment>,
      fakeContext({
        pathname: '/homeFake'
      })
    );
    expect(wrapper.find('p')).to.have.lengthOf(0);
  });

  const multiRoutes = [
    '/home/messages/:team/:channel',
    '/home/messages/:team',
    '/home/messages',
    '/home'
  ];

  it('renders if the current URL matches any of a given list of routes', () => {
    const multiPathnames = [
      '/home/messages/a-team/pity-fool',
      '/home/messages/a-team',
      '/home/messages',
      '/home'
    ];

    multiPathnames.forEach(pathname => {
      const wrapper = mount(
        <AbsoluteFragment forRoutes={multiRoutes}>
          <p>If we hit that bullseye, the rest of the dominos will fall like a house of cards. Checkmate.</p>
        </AbsoluteFragment>,
        fakeContext({ pathname })
      );
      expect(wrapper.find('p').node.textContent).to.equal(
        'If we hit that bullseye, the rest of the dominos will fall like a house of cards. Checkmate.'
      );
    });
  });

  it('renders nothing if the current URL matches none of a given list of routes', () => {
    const wrapper = mount(
      <AbsoluteFragment forRoutes={multiRoutes}>
        <p>Nothing to see here!</p>
      </AbsoluteFragment>,
      fakeContext({
        pathname: '/home/fhqwhgads'
      })
    );
    expect(wrapper.find('p')).to.have.lengthOf(0);
  });

  it('renders if the current location matches a predicate function', () => {
    const wrapper = mount(
      <AbsoluteFragment withConditions={location => location.query.ayy === 'lmao'}>
        <p>In the game of chess, you can never let your adversary see your pieces.</p>
      </AbsoluteFragment>,
      fakeContext({
        query: {
          ayy: 'lmao'
        }
      })
    );
    expect(wrapper.find('p').node.textContent).to.equal(
      'In the game of chess, you can never let your adversary see your pieces.'
    );
  });

  it('does not render if the current location does not match a predicate function', () => {
    const wrapper = mount(
      <AbsoluteFragment withConditions={location => location.query.ayy === 'jk'}>
        <p>In the game of chess, you can never let your adversary see your pieces.</p>
      </AbsoluteFragment>,
      fakeContext({
        query: {
          ayy: 'lmao'
        }
      })
    );
    expect(wrapper.get(0)).to.be.falsy;
  });
});

describe('RelativeFragment', () => {
  it('renders if the current URL matches the given route', () => {
    const wrapper = mount(
      <RelativeFragment forRoute='/home/messages/:team'>
        <p>Hey, wait, I'm having one of those things...you know, a headache with pictures.</p>
      </RelativeFragment>,
      fakeContext({
        pathname: '/home/messages/a-team'
      })
    );
    expect(wrapper.find('p').node.textContent).to.equal(
      'Hey, wait, I\'m having one of those things...you know, a headache with pictures.'
    );
  });

  it('renders deeply nested fragments', () => {
    const wrapper = mount(
      <RelativeFragment forRoute='/this'>
        <p>one</p>
        <RelativeFragment forRoute='/is'>
          <p>two</p>
          <RelativeFragment forRoute='/nested'>
            <p>three</p>
            <RelativeFragment forRoute='/:times'>
              <p>four</p>
              <RelativeFragment forRoute='/times'>
                <p>five</p>
              </RelativeFragment>
            </RelativeFragment>
          </RelativeFragment>
        </RelativeFragment>
      </RelativeFragment>,
      fakeContext({
        pathname: '/this/is/nested/five/times',
        route: '/this/is/nested/:times/times'
      })
    );

    ['one', 'two', 'three', 'four', 'five'].forEach(text => {
      expect(wrapper.containsMatchingElement(<p>{text}</p>))
        .to.be.true;
    });
  });

  it('does not render nested fragments that do not match the route', () => {
    const wrapper = mount(
      <RelativeFragment forRoute='/this'>
        <p>one</p>
        <RelativeFragment forRoute='/is'>
          <p>two</p>
          <RelativeFragment forRoute='/nested'>
            <p>three</p>
            <RelativeFragment forRoute='/:times'>
              <p>four</p>
              <RelativeFragment forRoute='/times'>
                <p>five</p>
              </RelativeFragment>
            </RelativeFragment>
          </RelativeFragment>
        </RelativeFragment>
      </RelativeFragment>,
      fakeContext({
        pathname: '/this/is/nested',
        route: '/this/is/nested'
      })
    );

    ['one', 'two', 'three'].forEach(text => {
      expect(wrapper.containsMatchingElement(<p>{text}</p>))
        .to.be.true;
    });

    ['four', 'five'].forEach(text => {
      expect(wrapper.containsMatchingElement(<p>{text}</p>))
        .to.be.false;
    });
  });

  it('does greedy matching', () => {
    const wrapper = mount(
      <RelativeFragment forRoute='/play'>
      <RelativeFragment forRoute='/c/:code'>
        <p>fist</p>
      </RelativeFragment>
      <RelativeFragment forRoute='/c'>
        <p>second</p>
      </RelativeFragment>
      <div>
        <ul>
          <li>
          <RelativeFragment forRoute='/c/:code'>
            <p>third</p>
          </RelativeFragment>
          </li>
        </ul>
      </div>
      <RelativeFragment forRoute='/c/code'>
        <p>fourth</p>
      </RelativeFragment>
      </RelativeFragment>,
      fakeContext({
        pathname: '/play/c/code',
        route: '/play/c/:code'
      })
    );

    expect(wrapper.containsMatchingElement(<p>fist</p>)).to.be.true;
    expect(wrapper.containsMatchingElement(<p>second</p>)).to.be.false;
    expect(wrapper.containsMatchingElement(<p>third</p>)).to.be.true;
    expect(wrapper.containsMatchingElement(<p>fourth</p>)).to.be.false;
  });

  describe('basic page-by-page routing', () => {
    // eslint-disable-next-line no-extra-parens
    const element = (
      <RelativeFragment forRoute='/'>
        <h1>App Title</h1>
        <RelativeFragment forRoute='/cheese'>
          <p>Cheese</p>
          <RelativeFragment forRoute='/gifs'>
            <p>Cheese Gifs</p>
          </RelativeFragment>
          <RelativeFragment forRoute='/:type'>
            <p>Cheese Type</p>
          </RelativeFragment>
        </RelativeFragment>
        <RelativeFragment forRoute='/dog'>
          <p>Dog</p>
          <RelativeFragment forRoute='/gifs'>
            <p>Dog Gifs</p>
          </RelativeFragment>
          <RelativeFragment forRoute='/:type'>
            <p>Dog Type</p>
          </RelativeFragment>
        </RelativeFragment>
        <RelativeFragment forRoute='/cat'>
          <p>Cat</p>
          <RelativeFragment forRoute='/gifs'>
            <p>Cat Gifs</p>
          </RelativeFragment>
          <RelativeFragment forRoute='/:type'>
            <p>Cat Type</p>
          </RelativeFragment>
        </RelativeFragment>
        <RelativeFragment forRoute='/hipster'>
          <p>Hipster</p>
          <RelativeFragment forRoute='/gifs'>
            <p>Hipster Gifs</p>
          </RelativeFragment>
          <RelativeFragment forRoute='/:type'>
            <p>Hipster Type</p>
          </RelativeFragment>
        </RelativeFragment>
      </RelativeFragment>
    );

    const contexts = [
      {
        pathname: '/',
        route: '/',
        assertion: wrapper => {
          expect(wrapper.containsMatchingElement(<h1>App Title</h1>))
            .to.be.true;
        }
      },
      {
        pathname: '/cheese',
        route: '/cheese',
        assertion: wrapper => {
          expect(wrapper.containsMatchingElement(<p>Cheese</p>))
            .to.be.true;
        }
      },
      {
        pathname: '/cheese/gorgonzola',
        route: '/cheese/:type',
        assertion: wrapper => {
          expect(wrapper.containsMatchingElement(<p>Cheese Type</p>))
            .to.be.true;
        }
      },
      {
        pathname: '/cheese/gifs',
        route: '/cheese/gifs',
        assertion: wrapper => {
          expect(wrapper.containsMatchingElement(<p>Cheese Gifs</p>))
            .to.be.true;
        }
      },
      {
        pathname: '/dog',
        route: '/dog',
        assertion: wrapper => {
          expect(wrapper.containsMatchingElement(<p>Dog</p>))
            .to.be.true;
        }
      },
      {
        pathname: '/dog/vizsla',
        route: '/dog/:type',
        assertion: wrapper => {
          expect(wrapper.containsMatchingElement(<p>Dog Type</p>))
            .to.be.true;
        }
      },
      {
        pathname: '/dog/gifs',
        route: '/dog/gifs',
        assertion: wrapper => {
          expect(wrapper.containsMatchingElement(<p>Dog Gifs</p>))
            .to.be.true;
        }
      },
      {
        pathname: '/cat',
        route: '/cat',
        assertion: wrapper => {
          expect(wrapper.containsMatchingElement(<p>Cat</p>))
            .to.be.true;
        }
      },
      {
        pathname: '/cat/persian',
        route: '/cat/:type',
        assertion: wrapper => {
          expect(wrapper.containsMatchingElement(<p>Cat Type</p>))
            .to.be.true;
        }
      },
      {
        pathname: '/cat/gifs',
        route: '/cat/gifs',
        assertion: wrapper => {
          expect(wrapper.containsMatchingElement(<p>Cat Gifs</p>))
            .to.be.true;
        }
      },
      {
        pathname: '/hipster',
        route: '/hipster',
        assertion: wrapper => {
          expect(wrapper.containsMatchingElement(<p>Hipster</p>))
            .to.be.true;
        }
      },
      {
        pathname: '/hipster/freegan',
        route: '/hipster/:type',
        assertion: wrapper => {
          expect(wrapper.containsMatchingElement(<p>Hipster Type</p>))
            .to.be.true;
        }
      },
      {
        pathname: '/hipster/gifs',
        route: '/hipster/gifs',
        assertion: wrapper => {
          expect(wrapper.containsMatchingElement(<p>Hipster Gifs</p>))
            .to.be.true;
        }
      }
    ];

    contexts.forEach(context => {
      const { pathname, route, assertion } = context;
      const wrapper = mount(element, fakeContext({
        pathname,
        route
      }));

      it(`${pathname} ${route}`, () => assertion(wrapper));
    });
  });
});
