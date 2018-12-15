import flattenRoutes from '../../../src/util/flatten-routes';

export default flattenRoutes({
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
  },
  '/home/email/:customparam': {
    name: 'custom',
    patternOptions: { segmentValueCharset: 'a-zA-Z0-9-_~ %@.' }
  },
  '/': {
    '/oh': {
      name: 'oh',
      '/hai': {
        name: 'hai',
        '/:mark': {
          '/mark': {
            name: 'mark'
          }
        }
      }
    },
    '/this': {
      name: 'this',
      '/is': {
        name: 'is',
        '/nested': {
          name: 'nested',
          '/:times': {
            '/times': {
              name: 'times'
            }
          }
        }
      }
    },
    '/cheese': {
      '/gifs': {},
      '/:type': {}
    },
    '/dog': {
      '/gifs': {},
      '/:type': {}
    },
    '/cat': {
      '/gifs': {},
      '/:type': {}
    },
    '/hipster': {
      '/gifs': {},
      '/:type': {}
    },
    '/foo': {
      '/bar': {
        '/you': {
          '/again': {}
        },
        '/me': {}
      }
    }
  }
});
