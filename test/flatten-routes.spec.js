/* eslint-disable max-nested-callbacks */
import { expect } from 'chai';

import flattenRoutes from '../src/flatten-routes';

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
        'title': 'Thing'
      },
      '/messages/:user': {
        'title': 'Messages by User'
      },
      '/lmao/:ayy': {
        'title': 'lmaos with ayys'
      },
      '/nested/a/:f': {
        'title': 'f'
      },
      '/nested/a': {
        'title': 'a'
      },
      '/messages': {
        'title': 'Messages'
      },
      '/lmao': {
        'title': 'lmao'
      },
      '/things/stuff': {
        'title': 'flat route!'
      },
      '/nested': {
        'title': 'Nested'
      },
      '/': {
        'title': 'Home'
      }
    });
  });
});
