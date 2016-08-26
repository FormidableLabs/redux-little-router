/* eslint-disable max-len, no-magic-numbers */
import { expect } from 'chai';
import { mount} from 'enzyme';

import React from 'react';

import Fragment from '../src/fragment';

import { fakeContext } from './util';

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

  it('renders nothing if the current URL does not match the given route', () => {
    const wrapper = mount(
      <Fragment forRoute='/home/messages/:team'>
        <p>Nothing to see here!</p>
      </Fragment>,
      fakeContext({
        pathname: '/home'
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
        <Fragment forRoutes={multiRoutes}>
          <p>If we hit that bullseye, the rest of the dominos will fall like a house of cards. Checkmate.</p>
        </Fragment>,
        fakeContext({ pathname })
      );
      expect(wrapper.find('p').node.textContent).to.equal(
        'If we hit that bullseye, the rest of the dominos will fall like a house of cards. Checkmate.'
      );
    });
  });

  it('renders nothing if the current URL matches none of a given list of routes', () => {
    const wrapper = mount(
      <Fragment forRoutes={multiRoutes}>
        <p>Nothing to see here!</p>
      </Fragment>,
      fakeContext({
        pathname: '/home/fhqwhgads'
      })
    );
    expect(wrapper.find('p')).to.have.lengthOf(0);
  });

  it('renders if the current location matches a predicate function', () => {
    const wrapper = mount(
      <Fragment withConditions={
        location => location.query.ayy === 'lmao'
      }>
        <p>In the game of chess, you can never let your adversary see your pieces.</p>
      </Fragment>,
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

  it('renders if the current location matches a predicate function', () => {
    const wrapper = mount(
      <Fragment withConditions={
        location => location.query.ayy === 'lmao'
      }>
        <p>In the game of chess, you can never let your adversary see your pieces.</p>
      </Fragment>,
      fakeContext({
        query: {
          ayy: 'yyy'
        }
      })
    );
    expect(wrapper.find('p')).to.have.lengthOf(0);
  });

  it('renders if the current URL matches a given route component', () => {
    const wrapper = mount(
      <Fragment inRoute=':team'>
        <p>As you know, the key to victory is the element of surprise. Surprise!</p>
      </Fragment>,
      fakeContext({
        pathname: '/home/messages/a-team'
      })
    );
    expect(wrapper.find('p').node.textContent).to.equal(
      'As you know, the key to victory is the element of surprise. Surprise!'
    );
  });

  it('renders nothing if the current URL does not match a given route component', () => {
    const wrapper = mount(
      <Fragment inRoute='messages'>
        <p>Nothing to see here!</p>
      </Fragment>,
      fakeContext({
        pathname: '/home'
      })
    );
    expect(wrapper.find('p')).to.have.lengthOf(0);
  });

  it('renders if the current URL matches a given parent route component', () => {
    const wrapper = mount(
      <Fragment inRoute='home'>
        <p>You win again, gravity!</p>
      </Fragment>,
      fakeContext({
        pathname: '/home/messages/a-team'
      })
    );
    expect(wrapper.find('p').node.textContent).to.equal(
      'You win again, gravity!'
    );
  });

});
