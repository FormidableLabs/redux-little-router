// Original
// const routes = {
//   '/home': {
//     name: 'home'
//   },
//   '/home/messages': {
//     name: 'messages'
//   },
//   '/home/messages/:team': {
//     name: 'team'
//   },
//   '/home/messages/:team/:channel': {
//     name: 'channel'
//   },
//   '/home/:spookyparam': {
//     name: '3spooky5me'
//   }
// };

// Attempt 1 (Possibly the best so far)
const root = { routeComponent: '/', name:'root' };
const home = { routeComponent:'home', name:'home' };
const messages = { routeComponent:'messages', name:'messages' };
const team = { routeComponent:':team', name:'team' };
const channel = { routeComponent:':channel', name:'channel' };
const spookyparam = { routeComponent:':spookyparam', name:'3spooky5me' };

const routes = Object.assign(root, {
  children: [Object.assign(home, {
    children: [Object.assign(messages, {
      children: [Object.assign(team, {
        children: [Object.assign(channel, {})]
      })]
    }), Object.assign(spookyparam, {})]
  })]
});
/*
// Attempt 2 (Awful)
const routes = Object.assign(
  root, {
    children: [
      Object.assign(
        home, {
          children: [
            Object.assign(
              messages, {
                children: [
                  Object.assign(
                    team, {
                      children: [
                        Object.assign(
                          channel,
                          {}
                        )
                      ]
                    }
                  )
                ]
              }
            ),
            Object.assign(
              spookyparam,
              {}
            )
          ]
        }
      )
    ]
  }
);

// Attempt 3 (Not awful, but not good)
const routes = {
  name:'root',
  children: [
    {
      name: 'home',
      route: 'home',
      children: [
        {
          route: 'messages',
          name: 'messages',
          children: [
            {
              route:':team',
              name:'team',
              children: [
                {
                  route:':channel',
                  name:'channel'
                }
              ]
            }
          ]
        },
        {
          route:':spookyparam',
          name:'3spooky5me'
        }
      ]
    }
  ]
};

// Attempt 4 (Awful)
const routes = { name:'root', children: [
  { name: 'home', route: 'home', children: [
    { route: 'messages', name: 'messages', children: [
      { route:':team', name:'team', children: [
        { route:':channel', name:'channel' }
      ]}
    ]}, { route:':spookyparam', name:'3spooky5me' }
  ]}
]};

// Attempt 5 (Reverse order potentially confusing)
const channel = { route:':channel', name:'channel' };

const team = { route:':team', name:'team', children: [channel] };

const messages = { route:'messages', name:'messages', children: [team] };
const spookyparam = { route:':spookyparam', name:'3spooky5me' };

const home = { route:'home', name:'home', children: [messages, spookyparam] };

const root = { name:'root', children: [home] };

const routes = root;
*/

export default routes;
