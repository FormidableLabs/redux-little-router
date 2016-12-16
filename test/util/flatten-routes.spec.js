/* eslint-disable max-nested-callbacks */
import { expect } from 'chai';

import flattenRoutes from '../../src/util/flatten-routes';

describe('Route flattening', () => {
  it('does not affect flat routes', () => {
    const flatRoutes = {
      '/': {
        title: 'Home'
      },
      '/messages': {
        title: 'Message'
      },
      '/messages/:user': {
        title: 'Message History'
      }
    };

    expect(flattenRoutes(flatRoutes)).to.deep.equal(flatRoutes);
  });

  it('flattens nested routes', () => {
    const nestedRoutes = {
      '/': {
        title: 'Home',
        '/messages': {
          title: 'Messages',
          '/:user': {
            title: 'Messages by User',
            '/:thing': {
              title: 'Thing'
            }
          }
        },
        '/lmao': {
          title: 'lmao',
          '/:ayy': {
            title: 'lmaos with ayys'
          }
        },
        '/things/stuff': {
          title: 'flat route!'
        },
        '/nested': {
          title: 'Nested',
          '/a': {
            title: 'a',
            '/:f': {
              title: 'f'
            }
          }
        }
      }
    };

    expect(flattenRoutes(nestedRoutes)).to.deep.equal({
      '/messages/:user/:thing': {
        'title': 'Thing',
        'parent': {
          'title': 'Messages by User',
          'parent': {
            'title': 'Messages',
            'parent': {
              'title': 'Home',
              'route': '/'
            },
            'route': '/messages'
          },
          'route': '/messages/:user'
        }
      },
      '/messages/:user': {
        'title': 'Messages by User',
        'parent': {
          'title': 'Messages',
          'parent': {
            'title': 'Home',
            'route': '/'
          },
          'route': '/messages'
        }
      },
      '/lmao/:ayy': {
        'title': 'lmaos with ayys',
        'parent': {
          'title': 'lmao',
          'parent': {
            'title': 'Home',
            'route': '/'
          },
          'route': '/lmao'
        }
      },
      '/nested/a/:f': {
        'title': 'f',
        'parent': {
          'title': 'a',
          'parent': {
            'title': 'Nested',
            'parent': {
              'title': 'Home',
              'route': '/'
            },
            'route': '/nested'
          },
          'route': '/nested/a'
        }
      },
      '/nested/a': {
        'title': 'a',
        'parent': {
          'title': 'Nested',
          'parent': {
            'title': 'Home',
            'route': '/'
          },
          'route': '/nested'
        }
      },
      '/messages': {
        'title': 'Messages',
        'parent': {
          'title': 'Home',
          'route': '/'
        }
      },
      '/lmao': {
        'title': 'lmao',
        'parent': {
          'title': 'Home',
          'route': '/'
        }
      },
      '/things/stuff': {
        'title': 'flat route!',
        'parent': {
          'title': 'Home',
          'route': '/'
        }
      },
      '/nested': {
        'title': 'Nested',
        'parent': {
          'title': 'Home',
          'route': '/'
        }
      },
      '/': {
        'title': 'Home'
      }
    });
  });
});
