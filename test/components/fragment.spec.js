/* eslint-disable max-len, no-magic-numbers */
import { expect } from 'chai';
import { mount } from 'enzyme';

import React from 'react';

import Fragment from '../../src/components/fragment';
import ImmutableFragment from '../../src/immutable/components/fragment';

import { fakeContext, fakeImmutableContext } from '../test-util';

describe('Fragment', () => {
  // `renderWithFragment` should be a function that takes a `FragmentComponent` as an argument
  // and returns jsx.
  const setupFragments = (renderWithFragment, context) => ({
    wrapper: mount(
      renderWithFragment(Fragment),
      fakeContext(context)
    ),
    immutableWrapper: mount(
      renderWithFragment(ImmutableFragment),
      fakeImmutableContext(context)
    )
  });

  it('renders if the current URL matches the given route', () => {
    const { wrapper, immutableWrapper } = setupFragments(
      (FragmentComponent) => (
        <FragmentComponent forRoute="/home/messages/:team">
          <p>Hey, wait, I'm having one of those things...you know, a headache with pictures.</p>
        </FragmentComponent>
      ),
      { pathname: '/home/messages/a-team' }
    );

    [wrapper, immutableWrapper].forEach(w => {
      expect(w.find('p').node.textContent).to.equal(
        "Hey, wait, I'm having one of those things...you know, a headache with pictures."
      );
    });
  });

  it('renders `withLocations` without `forRoute` in the correct order', () => {
    const { wrapper, immutableWrapper } = setupFragments(
      (FragmentComponent) => (
        <FragmentComponent forRoute='/'>
          <div>
            <FragmentComponent withConditions={location => location.query.renderMe}>
              <p>Render me pls</p>
            </FragmentComponent>
            <FragmentComponent forRoute='/boop'>
              <p>Boop</p>
            </FragmentComponent>
          </div>
        </FragmentComponent>
      ),
      {
        pathname: '/boop',
        route: '/boop',
        query: { renderMe: true }
      }
    );

    [wrapper, immutableWrapper].forEach(w => {
      expect(w.containsMatchingElement(<p>Render me pls</p>)).to.be.true;
      expect(w.containsMatchingElement(<p>Boop</p>)).to.be.false;
    });
  });

  it('renders `withLocations` without `forRoute` in the correct order when reversed', () => {
    const { wrapper, immutableWrapper } = setupFragments(
      (FragmentComponent) => (
        <FragmentComponent forRoute='/'>
          <div>
            <FragmentComponent forRoute='/boop'>
              <p>Boop</p>
            </FragmentComponent>
            <FragmentComponent withConditions={location => location.query.renderMe}>
              <p>Render me pls</p>
            </FragmentComponent>
          </div>
        </FragmentComponent>
      ),
      {
        pathname: '/boop',
        route: '/boop',
        query: { renderMe: true }
      }
    );

    [wrapper, immutableWrapper].forEach(w => {
      expect(w.containsMatchingElement(<p>Render me pls</p>)).to.be.false;
      expect(w.containsMatchingElement(<p>Boop</p>)).to.be.true;
    });
  });

  it('renders deeply nested fragments', () => {
    const { wrapper, immutableWrapper } = setupFragments(
      (FragmentComponent) => (
        <FragmentComponent forRoute='/this'>
          <div>
            <p>one</p>
            <FragmentComponent forRoute='/is'>
              <div>
                <p>two</p>
                <FragmentComponent forRoute='/nested'>
                  <div>
                    <p>three</p>
                    <FragmentComponent forRoute='/:times'>
                      <div>
                        <p>four</p>
                        <FragmentComponent forRoute='/times'>
                          <p>five</p>
                        </FragmentComponent>
                      </div>
                    </FragmentComponent>
                  </div>
                </FragmentComponent>
              </div>
            </FragmentComponent>
          </div>
        </FragmentComponent>
      ),
      {
        pathname: '/this/is/nested/five/times',
        route: '/this/is/nested/:times/times'
      }
    );

    [wrapper, immutableWrapper].forEach(w => {
      ['one', 'two', 'three', 'four', 'five'].forEach(text => {
        expect(w.containsMatchingElement(<p>{text}</p>)).to.be.true;
      });
    });
  });

  it('does not render nested fragments that do not match the route', () => {
    const { wrapper, immutableWrapper } = setupFragments(
      (FragmentComponent) => (
        <FragmentComponent forRoute='/this'>
          <div>
            <p>one</p>
            <FragmentComponent forRoute='/is'>
              <div>
                <p>two</p>
                <FragmentComponent forRoute='/nested'>
                  <div>
                    <p>three</p>
                    <FragmentComponent forRoute='/:times'>
                      <div>
                        <p>four</p>
                        <FragmentComponent forRoute='/times'>
                          <p>five</p>
                        </FragmentComponent>
                      </div>
                    </FragmentComponent>
                  </div>
                </FragmentComponent>
              </div>
            </FragmentComponent>
          </div>
        </FragmentComponent>
      ),
      {
        pathname: '/this/is/nested',
        route: '/this/is/nested'
      }
    );

    [wrapper, immutableWrapper].forEach(w => {
      ['one', 'two', 'three'].forEach(text => {
        expect(w.containsMatchingElement(<p>{text}</p>)).to.be.true;
      });

      ['four', 'five'].forEach(text => {
        expect(w.containsMatchingElement(<p>{text}</p>)).to.be.false;
      });
    });
  });

  it('does greedy matching', () => {
    const { wrapper, immutableWrapper } = setupFragments(
      (FragmentComponent) => (
        <FragmentComponent forRoute='/oh'>
          <div>
            <FragmentComponent forRoute='/hai/:mark'>
              <p>first</p>
            </FragmentComponent>
            <FragmentComponent forRoute='/hai'>
              <p>second</p>
            </FragmentComponent>
            <div>
              <ul>
                <li>
                  <FragmentComponent forRoute='/hai/:mark'>
                    <p>third</p>
                  </FragmentComponent>
                </li>
              </ul>
            </div>
            <FragmentComponent forRoute='/hai/mark'>
              <p>fourth</p>
            </FragmentComponent>
          </div>
        </FragmentComponent>
      ),
      {
        pathname: '/oh/hai/mark',
        route: '/oh/hai/:mark'
      }
    );

    [wrapper, immutableWrapper].forEach(w => {
      expect(w.containsMatchingElement(<p>first</p>)).to.be.true;
      expect(w.containsMatchingElement(<p>second</p>)).to.be.false;
      expect(w.containsMatchingElement(<p>third</p>)).to.be.true;
      expect(w.containsMatchingElement(<p>fourth</p>)).to.be.false;
    });
  });

  it('renders nested /', () => {
    const { wrapper, immutableWrapper } = setupFragments(
      (FragmentComponent) => (
        <FragmentComponent forRoute='/'>
          <div>
            <p>first</p>
            <FragmentComponent forRoute='/'>
              <p>second</p>
            </FragmentComponent>
            <FragmentComponent forRoute='/oh'>
              <p>third</p>
            </FragmentComponent>
          </div>
        </FragmentComponent>
      ),
      {
        pathname: '/',
        route: '/'
      }
    );

    [wrapper, immutableWrapper].forEach(w => {
      expect(w.containsMatchingElement(<p>first</p>)).to.be.true;
      expect(w.containsMatchingElement(<p>second</p>)).to.be.true;
      expect(w.containsMatchingElement(<p>third</p>)).to.be.false;
    });
  });

  it('renders nested / with reversed order', () => {
    const { wrapper, immutableWrapper } = setupFragments(
      (FragmentComponent) => (
        <FragmentComponent forRoute='/'>
          <div>
            <p>first</p>
            <FragmentComponent forRoute='/oh'>
              <p>second</p>
            </FragmentComponent>
            <FragmentComponent forRoute='/'>
              <p>third</p>
            </FragmentComponent>
          </div>
        </FragmentComponent>
      ),
      {
        pathname: '/',
        route: '/'
      }
    );

    [wrapper, immutableWrapper].forEach(w => {
      expect(w.containsMatchingElement(<p>first</p>)).to.be.true;
      expect(w.containsMatchingElement(<p>second</p>)).to.be.false;
      expect(w.containsMatchingElement(<p>third</p>)).to.be.true;
    });
  });

  it('does exact matching for non-root / (reversed order)', () => {
    const { wrapper, immutableWrapper } = setupFragments(
      (FragmentComponent) => (
        <FragmentComponent forRoute='/'>
          <div>
            <p>first</p>
            <FragmentComponent forRoute='/oh'>
              <p>second</p>
            </FragmentComponent>
            <FragmentComponent forRoute='/'>
              <p>third</p>
            </FragmentComponent>
          </div>
        </FragmentComponent>
      ),
      {
        pathname: '/oh',
        route: '/oh'
      }
    );

    [wrapper, immutableWrapper].forEach(w => {
      expect(w.containsMatchingElement(<p>first</p>)).to.be.true;
      expect(w.containsMatchingElement(<p>second</p>)).to.be.true;
      expect(w.containsMatchingElement(<p>third</p>)).to.be.false;
    });
  });

  it('matches nested index', () => {
    const { wrapper, immutableWrapper } = setupFragments(
      (FragmentComponent) => (
        <FragmentComponent forRoute='/foo'>
          <div>
            <p>first</p>
            <FragmentComponent forRoute='/'>
              <p>second</p>
            </FragmentComponent>
            <FragmentComponent forRoute='/bar'>
              <p>third</p>
            </FragmentComponent>
          </div>
        </FragmentComponent>
      ),
      {
        pathname: '/foo',
        route: '/foo'
      }
    );

    [wrapper, immutableWrapper].forEach(w => {
      expect(w.containsMatchingElement(<p>first</p>)).to.be.true;
      expect(w.containsMatchingElement(<p>second</p>)).to.be.true;
      expect(w.containsMatchingElement(<p>third</p>)).to.be.false;
    });
  });

  it('matches double nested index', () => {
    const { wrapper, immutableWrapper } = setupFragments(
      (FragmentComponent) => (
        <FragmentComponent forRoute='/foo'>
          <FragmentComponent forRoute='/bar'>
            <div>
              <p>first</p>
              <FragmentComponent forRoute='/'>
                <p>second</p>
              </FragmentComponent>
              <FragmentComponent forRoute='/you'>
                <p>third</p>
              </FragmentComponent>
            </div>
          </FragmentComponent>
        </FragmentComponent>
      ),
      {
        pathname: '/foo/bar',
        route: '/foo/bar'
      }
    );

    [wrapper, immutableWrapper].forEach(w => {
      expect(w.containsMatchingElement(<p>first</p>)).to.be.true;
      expect(w.containsMatchingElement(<p>second</p>)).to.be.true;
      expect(w.containsMatchingElement(<p>third</p>)).to.be.false;
    });
  });

  it('respects ordering of nested index', () => {
    const { wrapper, immutableWrapper } = setupFragments(
      (FragmentComponent) => (
        <FragmentComponent forRoute='/foo'>
          <div>
            <p>first</p>
            <FragmentComponent forRoute='/'>
              <p>second</p>
            </FragmentComponent>
            <FragmentComponent forRoute='/bar'>
              <p>third</p>
            </FragmentComponent>
          </div>
        </FragmentComponent>
      ),
      {
        pathname: '/foo/bar',
        route: '/foo/bar'
      }
    );

    [wrapper, immutableWrapper].forEach(w => {
      expect(w.containsMatchingElement(<p>first</p>)).to.be.true;
      expect(w.containsMatchingElement(<p>second</p>)).to.be.true;
      expect(w.containsMatchingElement(<p>third</p>)).to.be.false;
    });
  });

  it('respects ordering of double nested index', () => {
    const { wrapper, immutableWrapper } = setupFragments(
      (FragmentComponent) => (
        <FragmentComponent forRoute='/foo'>
          <FragmentComponent forRoute='/bar'>
            <div>
              <p>first</p>
              <FragmentComponent forRoute='/you'>
                <div>
                  <p>third</p>
                  <FragmentComponent forRoute='/'>
                    <p>fourth</p>
                  </FragmentComponent>
                  <FragmentComponent forRoute='/again'>
                    <p>fifth</p>
                  </FragmentComponent>
                </div>
              </FragmentComponent>
              <FragmentComponent forRoute='/me'>
                <p>sixth</p>
              </FragmentComponent>
              <FragmentComponent forRoute='/'>
                <p>second</p>
              </FragmentComponent>
            </div>
          </FragmentComponent>
        </FragmentComponent>
      ),
      {
        pathname: '/foo/bar/you/again',
        route: '/foo/bar/you/again'
      }
    );

    [wrapper, immutableWrapper].forEach(w => {
      expect(w.containsMatchingElement(<p>first</p>)).to.be.true;
      expect(w.containsMatchingElement(<p>second</p>)).to.be.false;
      expect(w.containsMatchingElement(<p>third</p>)).to.be.true;
      expect(w.containsMatchingElement(<p>fourth</p>)).to.be.true;
      expect(w.containsMatchingElement(<p>fifth</p>)).to.be.false;
      expect(w.containsMatchingElement(<p>sixth</p>)).to.be.false;
    });
  });

  describe('basic page-by-page routing', () => {
    // eslint-disable-next-line no-extra-parens
    const renderWithFragment = (FragmentComponent) => (
      <FragmentComponent forRoute='/'>
        <div>
          <h1>App Title</h1>
          <FragmentComponent forRoute='/cheese'>
            <div>
              <p>Cheese</p>
              <FragmentComponent forRoute='/gifs'>
                <p>Cheese Gifs</p>
              </FragmentComponent>
              <FragmentComponent forRoute='/:type'>
                <p>Cheese Type</p>
              </FragmentComponent>
            </div>
          </FragmentComponent>
          <FragmentComponent forRoute='/dog'>
            <div>
              <p>Dog</p>
              <FragmentComponent forRoute='/gifs'>
                <p>Dog Gifs</p>
              </FragmentComponent>
              <FragmentComponent forRoute='/:type'>
                <p>Dog Type</p>
              </FragmentComponent>
            </div>
          </FragmentComponent>
          <FragmentComponent forRoute='/cat'>
            <div>
              <p>Cat</p>
              <FragmentComponent forRoute='/gifs'>
                <p>Cat Gifs</p>
              </FragmentComponent>
              <FragmentComponent forRoute='/:type'>
                <p>Cat Type</p>
              </FragmentComponent>
            </div>
          </FragmentComponent>
          <FragmentComponent forRoute='/hipster'>
            <div>
              <p>Hipster</p>
              <FragmentComponent forRoute='/gifs'>
                <p>Hipster Gifs</p>
              </FragmentComponent>
              <FragmentComponent forRoute='/:type'>
                <p>Hipster Type</p>
              </FragmentComponent>
            </div>
          </FragmentComponent>
        </div>
      </FragmentComponent>
    );

    const contexts = [
      {
        pathname: '/',
        route: '/',
        assertion: wrapper => {
          expect(
            wrapper.containsMatchingElement(<h1>App Title</h1>)
          ).to.be.true;
        }
      },
      {
        pathname: '/cheese',
        route: '/cheese',
        assertion: wrapper => {
          expect(wrapper.containsMatchingElement(<p>Cheese</p>)).to.be.true;
        }
      },
      {
        pathname: '/cheese/gorgonzola',
        route: '/cheese/:type',
        assertion: wrapper => {
          expect(
            wrapper.containsMatchingElement(<p>Cheese Type</p>)
          ).to.be.true;
        }
      },
      {
        pathname: '/cheese/gifs',
        route: '/cheese/gifs',
        assertion: wrapper => {
          expect(
            wrapper.containsMatchingElement(<p>Cheese Gifs</p>)
          ).to.be.true;
        }
      },
      {
        pathname: '/dog',
        route: '/dog',
        assertion: wrapper => {
          expect(wrapper.containsMatchingElement(<p>Dog</p>)).to.be.true;
        }
      },
      {
        pathname: '/dog/vizsla',
        route: '/dog/:type',
        assertion: wrapper => {
          expect(wrapper.containsMatchingElement(<p>Dog Type</p>)).to.be.true;
        }
      },
      {
        pathname: '/dog/gifs',
        route: '/dog/gifs',
        assertion: wrapper => {
          expect(wrapper.containsMatchingElement(<p>Dog Gifs</p>)).to.be.true;
        }
      },
      {
        pathname: '/cat',
        route: '/cat',
        assertion: wrapper => {
          expect(wrapper.containsMatchingElement(<p>Cat</p>)).to.be.true;
        }
      },
      {
        pathname: '/cat/persian',
        route: '/cat/:type',
        assertion: wrapper => {
          expect(wrapper.containsMatchingElement(<p>Cat Type</p>)).to.be.true;
        }
      },
      {
        pathname: '/cat/gifs',
        route: '/cat/gifs',
        assertion: wrapper => {
          expect(wrapper.containsMatchingElement(<p>Cat Gifs</p>)).to.be.true;
        }
      },
      {
        pathname: '/hipster',
        route: '/hipster',
        assertion: wrapper => {
          expect(wrapper.containsMatchingElement(<p>Hipster</p>)).to.be.true;
        }
      },
      {
        pathname: '/hipster/freegan',
        route: '/hipster/:type',
        assertion: wrapper => {
          expect(
            wrapper.containsMatchingElement(<p>Hipster Type</p>)
          ).to.be.true;
        }
      },
      {
        pathname: '/hipster/gifs',
        route: '/hipster/gifs',
        assertion: wrapper => {
          expect(
            wrapper.containsMatchingElement(<p>Hipster Gifs</p>)
          ).to.be.true;
        }
      }
    ];

    contexts.forEach(context => {
      const { pathname, route, assertion } = context;
      const { wrapper, immutableWrapper } = setupFragments(
        renderWithFragment,
        {
          pathname,
          route
        }
      );

      [wrapper, immutableWrapper].forEach(w => {
        it(`${pathname} ${route}`, () => assertion(w));
      });
    });
  });
});
