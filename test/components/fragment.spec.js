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
        <div>
          <p>one</p>
          <Fragment forRoute='/is'>
            <div>
              <p>two</p>
              <Fragment forRoute='/nested'>
                <div>
                  <p>three</p>
                  <Fragment forRoute='/:times'>
                    <div>
                      <p>four</p>
                      <Fragment forRoute='/times'>
                        <p>five</p>
                      </Fragment>
                    </div>
                  </Fragment>
                </div>
              </Fragment>
            </div>
          </Fragment>
        </div>
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
        <div>
          <p>one</p>
          <Fragment forRoute='/is'>
            <div>
              <p>two</p>
              <Fragment forRoute='/nested'>
                <div>
                  <p>three</p>
                  <Fragment forRoute='/:times'>
                    <div>
                      <p>four</p>
                      <Fragment forRoute='/times'>
                        <p>five</p>
                      </Fragment>
                    </div>
                  </Fragment>
                </div>
              </Fragment>
            </div>
          </Fragment>
        </div>
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
      <Fragment forRoute='/oh'>
        <div>
          <Fragment forRoute='/hai/:mark'>
            <p>first</p>
          </Fragment>
          <Fragment forRoute='/hai'>
            <p>second</p>
          </Fragment>
          <div>
            <ul>
              <li>
              <Fragment forRoute='/hai/:mark'>
                <p>third</p>
              </Fragment>
              </li>
            </ul>
          </div>
          <Fragment forRoute='/hai/mark'>
            <p>fourth</p>
          </Fragment>
        </div>
      </Fragment>,
      fakeContext({
        pathname: '/oh/hai/mark',
        route: '/oh/hai/:mark'
      })
    );

    expect(wrapper.containsMatchingElement(<p>first</p>)).to.be.true;
    expect(wrapper.containsMatchingElement(<p>second</p>)).to.be.false;
    expect(wrapper.containsMatchingElement(<p>third</p>)).to.be.true;
    expect(wrapper.containsMatchingElement(<p>fourth</p>)).to.be.false;
  });

  it('matches nested index', () => {
    const wrapper = mount(
      <Fragment forRoute='/foo'>
        <div>
          <p>first</p>
          <Fragment forRoute='/'>
            <p>second</p>
          </Fragment>
          <Fragment forRoute='/bar'>
            <p>third</p>
          </Fragment>
        </div>
      </Fragment>,
      fakeContext({
        pathname: '/foo',
        route: '/foo'
      })
    );

    expect(wrapper.containsMatchingElement(<p>first</p>)).to.be.true;
    expect(wrapper.containsMatchingElement(<p>second</p>)).to.be.true;
    expect(wrapper.containsMatchingElement(<p>third</p>)).to.be.false;
  });

  it('matches double nested index', () => {
    const wrapper = mount(
      <Fragment forRoute='/foo'>
        <Fragment forRoute='/bar'>
          <div>
            <p>first</p>
            <Fragment forRoute='/'>
              <p>second</p>
            </Fragment>
            <Fragment forRoute='/you'>
              <p>third</p>
            </Fragment>
          </div>
        </Fragment>
      </Fragment>,
      fakeContext({
        pathname: '/foo/bar',
        route: '/foo/bar'
      })
    );

    expect(wrapper.containsMatchingElement(<p>first</p>)).to.be.true;
    expect(wrapper.containsMatchingElement(<p>second</p>)).to.be.true;
    expect(wrapper.containsMatchingElement(<p>third</p>)).to.be.false;
  });

  it('doesnt match nested index', () => {
    const wrapper = mount(
      <Fragment forRoute='/foo'>
        <div>
          <p>first</p>
          <Fragment forRoute='/'>
            <p>second</p>
          </Fragment>
          <Fragment forRoute='/bar'>
            <p>third</p>
          </Fragment>
        </div>
      </Fragment>,
      fakeContext({
        pathname: '/foo/bar',
        route: '/foo/bar'
      })
    );
    expect(wrapper.containsMatchingElement(<p>first</p>)).to.be.true;
    expect(wrapper.containsMatchingElement(<p>second</p>)).to.be.false;
    expect(wrapper.containsMatchingElement(<p>third</p>)).to.be.true;
  });

  it('doesnt match double nested index', () => {
    const wrapper = mount(
      <Fragment forRoute='/foo'>
        <Fragment forRoute='/bar'>
          <div>
            <p>first</p>
            <Fragment forRoute='/'>
              <p>second</p>
            </Fragment>
            <Fragment forRoute='/you'>
              <p>third</p>
            </Fragment>
            <Fragment forRoute='/me'>
              <p>fourth</p>
            </Fragment>
          </div>
        </Fragment>
      </Fragment>,
      fakeContext({
        pathname: '/foo/bar/you',
        route: '/foo/bar/you'
      })
    );

    expect(wrapper.containsMatchingElement(<p>first</p>)).to.be.true;
    expect(wrapper.containsMatchingElement(<p>second</p>)).to.be.false;
    expect(wrapper.containsMatchingElement(<p>third</p>)).to.be.true;
    expect(wrapper.containsMatchingElement(<p>fourth</p>)).to.be.false;
  });


  describe('basic page-by-page routing', () => {
    // eslint-disable-next-line no-extra-parens
    const element = (
      <Fragment forRoute='/'>
        <div>
          <h1>App Title</h1>
          <Fragment forRoute='/cheese'>
            <div>
              <p>Cheese</p>
              <Fragment forRoute='/gifs'>
                <p>Cheese Gifs</p>
              </Fragment>
              <Fragment forRoute='/:type'>
                <p>Cheese Type</p>
              </Fragment>
            </div>
          </Fragment>
          <Fragment forRoute='/dog'>
            <div>
              <p>Dog</p>
              <Fragment forRoute='/gifs'>
                <p>Dog Gifs</p>
              </Fragment>
              <Fragment forRoute='/:type'>
                <p>Dog Type</p>
              </Fragment>
            </div>
          </Fragment>
          <Fragment forRoute='/cat'>
            <div>
              <p>Cat</p>
              <Fragment forRoute='/gifs'>
                <p>Cat Gifs</p>
              </Fragment>
              <Fragment forRoute='/:type'>
                <p>Cat Type</p>
              </Fragment>
            </div>
          </Fragment>
          <Fragment forRoute='/hipster'>
            <div>
              <p>Hipster</p>
              <Fragment forRoute='/gifs'>
                <p>Hipster Gifs</p>
              </Fragment>
              <Fragment forRoute='/:type'>
                <p>Hipster Type</p>
              </Fragment>
            </div>
          </Fragment>
        </div>
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
