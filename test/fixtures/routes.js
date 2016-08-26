// export default {
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

const root = { name:'root' };
const home = { route:'home', name:'home' };
const messages = { route:'messages', name:'home' };
const team = { route:':team', name:'team' };
const channel = { route:':channel', name:'channel' };
const spookyparam = { route:'spookyparam', name:'3spooky5me' };

const routes = Object.assign(root, {
  children: [Object.assign(home, {
    children: [Object.assign(messages, {
      children: [Object.assign(team, {
        children: [Object.assign(channel, {})]
      })]
    })]
  }), Object.assign(spookyparam, {})]
});

export default routes;
