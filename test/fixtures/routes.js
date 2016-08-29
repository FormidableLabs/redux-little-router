const root = { routeComponent: '/', name:'root' };
const home = { routeComponent:'home', name:'home' };
const messages = { routeComponent:'messages', name:'messages' };
const team = { routeComponent:':team', name:'team' };
const channel = { routeComponent:':channel', name:'channel' };
const spookyparam = { routeComponent:':spookyparam', name:'3spooky5me' };
const global = { routeComponent:'global', name:'global' };

// Attmempt 7 (Improvement on attempt 6. Seems the simplest)
function makeRoute(details, ...children) {
  return Object.assign({}, details, children ? { children } : {});
}

const routes =
makeRoute(root,
  makeRoute(home,
    makeRoute(messages,
      makeRoute(team,
        makeRoute(channel)
      )
    ),
    makeRoute(global,
      makeRoute(channel)
    ),
    makeRoute(spookyparam)
  )
);

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

// Attempt 1 (Not bad)
// const routes =
// Object.assign(root, {
//   children: [Object.assign(home, {
//     children: [Object.assign(messages, {
//       children: [Object.assign(team, {
//         children: [Object.assign(channel, {})]
//       })]
//     }), Object.assign(spookyparam, {})]
//   })]
// });

// Attempt 2 (Awful)
// const routes =
// Object.assign(
//   root, {
//     children: [
//       Object.assign(
//         home, {
//           children: [
//             Object.assign(
//               messages, {
//                 children: [
//                   Object.assign(
//                     team, {
//                       children: [
//                         Object.assign(
//                           channel,
//                           {}
//                         )
//                       ]
//                     }
//                   )
//                 ]
//               }
//             ),
//             Object.assign(
//               spookyparam,
//               {}
//             )
//           ]
//         }
//       )
//     ]
//   }
// );

// Attempt 3 (Also pretty awful)
// const routes =
// {
//   name:'root',
//   children: [
//     {
//       name: 'home',
//       route: 'home',
//       children: [
//         {
//           route: 'messages',
//           name: 'messages',
//           children: [
//             {
//               route:':team',
//               name:'team',
//               children: [
//                 {
//                   route:':channel',
//                   name:'channel'
//                 }
//               ]
//             }
//           ]
//         },
//         {
//           route:':spookyparam',
//           name:'3spooky5me'
//         }
//       ]
//     }
//   ]
// };

// Attempt 4 (Another fairly awful one)
// const routes =
// { name:'root', children: [
//   { name: 'home', route: 'home', children: [
//     { route: 'messages', name: 'messages', children: [
//       { route:':team', name:'team', children: [
//         { route:':channel', name:'channel' }
//       ]}
//     ]}, { route:':spookyparam', name:'3spooky5me' }
//   ]}
// ]};

// Attempt 5 (Reverse order, kinda tidy, but potentially confusing)
// const channel = { route:':channel', name:'channel' };
//
// const team = { route:':team', name:'team', children: [channel] };
//
// const messages = { route:'messages', name:'messages', children: [team] };
// const spookyparam = { route:':spookyparam', name:'3spooky5me' };
//
// const home = { route:'home', name:'home', children: [messages, spookyparam] };
//
// const root = { name:'root', children: [home] };
//
// const routes = root;


// Attempt 6 (Improvement on attempt 1)
// function makeRoute(details, children) {
//   return Object.assign({}, details, children ? { children } : {});
// }
//
// const routes =
// makeRoute(root, [
//   makeRoute(home, [
//     makeRoute(messages, [
//       makeRoute(team, [
//         makeRoute(channel)
//       ])
//     ]),
//     makeRoute(spookyparam)
//   ])
// ]);





// Attempt 8 (Alternate view to 7. On a single line unless there are multiple
// children)
// function makeRoute(details, ...children) {
//   return Object.assign({}, details, children ? { children } : {});
// }
//
// const routes =
// makeRoute(root,
//   makeRoute(home,
//     makeRoute(messages, makeRoute(team, makeRoute(channel))),
//     makeRoute(spookyparam)
//   )
// );


// Attempt 9 (Inline version of 7. Also pretty good)
// function makeRoute(details, ...children) {
//   return Object.assign({}, details, children ? { children } : {});
// }
//
// const routes =
// makeRoute({ routeComponent: '/', name:'root' },
//   makeRoute({ routeComponent:'home', name:'home' },
//     makeRoute({ routeComponent:'messages', name:'messages' },
//       makeRoute({ routeComponent:':team', name:'team' },
//         makeRoute({ routeComponent:':channel', name:'channel' })
//       )
//     ),
//     makeRoute({ routeComponent:':spookyparam', name:'3spooky5me' })
//   )
// );


export default routes;
