/* eslint-disable max-len, no-magic-numbers */
import { expect } from 'chai';
import { mount } from 'enzyme';

import React from 'react';

import Fragment from '../../src/components/fragment';

import { fakeContext } from '../test-util';

describe('Fragment', () => {
  it('renders if the current URL matches the given route', () => {
    const wrapper = mount(
      <Fragment forRoute='/home/messages/:team'>
        <p>Hey, wait, I'm having one of those things...you know, a headache with pictures.</p>
      </Fragment>,
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
      <Fragment forRoute='/this'>
        <p>one</p>
        <Fragment forRoute='/is'>
          <p>two</p>
          <Fragment forRoute='/nested'>
            <p>three</p>
            <Fragment forRoute='/:times'>
              <p>four</p>
              <Fragment forRoute='/times'>
                <p>five</p>
              </Fragment>
            </Fragment>
          </Fragment>
        </Fragment>
      </Fragment>,
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
      <Fragment forRoute='/this'>
        <p>one</p>
        <Fragment forRoute='/is'>
          <p>two</p>
          <Fragment forRoute='/nested'>
            <p>three</p>
            <Fragment forRoute='/:times'>
              <p>four</p>
              <Fragment forRoute='/times'>
                <p>five</p>
              </Fragment>
            </Fragment>
          </Fragment>
        </Fragment>
      </Fragment>,
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
      <Fragment forRoute='/play'>
      <Fragment forRoute='/c/:code'>
        <p>fist</p>
      </Fragment>
      <Fragment forRoute='/c'>
        <p>second</p>
      </Fragment>
      <div>
        <ul>
          <li>
          <Fragment forRoute='/c/:code'>
            <p>third</p>
          </Fragment>
          </li>
        </ul>
      </div>
      <Fragment forRoute='/c/code'>
        <p>fourth</p>
      </Fragment>
      </Fragment>,
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
      <Fragment forRoute='/'>
        <h1>App Title</h1>
        <Fragment forRoute='/cheese'>
          <p>Cheese</p>
          <Fragment forRoute='/gifs'>
            <p>Cheese Gifs</p>
          </Fragment>
          <Fragment forRoute='/:type'>
            <p>Cheese Type</p>
          </Fragment>
        </Fragment>
        <Fragment forRoute='/dog'>
          <p>Dog</p>
          <Fragment forRoute='/gifs'>
            <p>Dog Gifs</p>
          </Fragment>
          <Fragment forRoute='/:type'>
            <p>Dog Type</p>
          </Fragment>
        </Fragment>
        <Fragment forRoute='/cat'>
          <p>Cat</p>
          <Fragment forRoute='/gifs'>
            <p>Cat Gifs</p>
          </Fragment>
          <Fragment forRoute='/:type'>
            <p>Cat Type</p>
          </Fragment>
        </Fragment>
        <Fragment forRoute='/hipster'>
          <p>Hipster</p>
          <Fragment forRoute='/gifs'>
            <p>Hipster Gifs</p>
          </Fragment>
          <Fragment forRoute='/:type'>
            <p>Hipster Type</p>
          </Fragment>
        </Fragment>
      </Fragment>
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
