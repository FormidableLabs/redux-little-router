/* eslint-disable max-len, no-magic-numbers */
import { expect } from 'chai';
import { mount } from 'enzyme';

import React from 'react';

import { AbsoluteFragment, RelativeFragment } from '../src/fragment';

import { fakeContext } from './util';

describe('AbsoluteFragment', () => {
  it('renders if the current URL matches the given route', () => {
    const wrapper = mount(
      <AbsoluteFragment forRoute='/home/messages/:team'>
        <p>Hey, wait, I'm having one of those things...you know, a headache with pictures.</p>
      </AbsoluteFragment>,
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
      <AbsoluteFragment forRoute='/home/messages/:team'>
        <p>Nothing to see here!</p>
      </AbsoluteFragment>,
      fakeContext({
        pathname: '/home'
      })
    );
    expect(wrapper.find('p')).to.have.lengthOf(0);
  });

  it('renders nothing if the current URL does not match any of the routes', () => {
    const wrapper = mount(
      <AbsoluteFragment forRoute='/home'>
        <p>Nothing to see here!</p>
      </AbsoluteFragment>,
      fakeContext({
        pathname: '/homeFake'
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
        <AbsoluteFragment forRoutes={multiRoutes}>
          <p>If we hit that bullseye, the rest of the dominos will fall like a house of cards. Checkmate.</p>
        </AbsoluteFragment>,
        fakeContext({ pathname })
      );
      expect(wrapper.find('p').node.textContent).to.equal(
        'If we hit that bullseye, the rest of the dominos will fall like a house of cards. Checkmate.'
      );
    });
  });

  it('renders nothing if the current URL matches none of a given list of routes', () => {
    const wrapper = mount(
      <AbsoluteFragment forRoutes={multiRoutes}>
        <p>Nothing to see here!</p>
      </AbsoluteFragment>,
      fakeContext({
        pathname: '/home/fhqwhgads'
      })
    );
    expect(wrapper.find('p')).to.have.lengthOf(0);
  });

  it('renders if the current location matches a predicate function', () => {
    const wrapper = mount(
      <AbsoluteFragment withConditions={
        location => location.query.ayy === 'lmao'
      }>
        <p>In the game of chess, you can never let your adversary see your pieces.</p>
      </AbsoluteFragment>,
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
});

describe('RelativeFragment', () => {
  it('renders if the current URL matches the given route', () => {
    const wrapper = mount(
      <RelativeFragment forRoute='/home/messages/:team'>
        <p>Hey, wait, I'm having one of those things...you know, a headache with pictures.</p>
      </RelativeFragment>,
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
      <RelativeFragment forRoute='/this'>
        <p>one</p>
        <RelativeFragment forRoute='/is'>
          <p>two</p>
          <RelativeFragment forRoute='/nested'>
            <p>three</p>
            <RelativeFragment forRoute='/:times'>
              <p>four</p>
              <RelativeFragment forRoute='/times'>
                <p>five</p>
              </RelativeFragment>
            </RelativeFragment>
          </RelativeFragment>
        </RelativeFragment>
      </RelativeFragment>,
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
      <RelativeFragment forRoute='/this'>
        <p>one</p>
        <RelativeFragment forRoute='/is'>
          <p>two</p>
          <RelativeFragment forRoute='/nested'>
            <p>three</p>
            <RelativeFragment forRoute='/:times'>
              <p>four</p>
              <RelativeFragment forRoute='/times'>
                <p>five</p>
              </RelativeFragment>
            </RelativeFragment>
          </RelativeFragment>
        </RelativeFragment>
      </RelativeFragment>,
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
});
