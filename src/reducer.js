// @flow
import type { Location, LocationDescriptorObject } from 'history';
import { LOCATION_CHANGED } from './actions';

export type LocationChangedAction = {
  type: 'ROUTER_LOCATION_CHANGED',
  payload: Location
};

export type State = LocationDescriptorObject & {
  previous?: LocationDescriptorObject
};

export default
  (initialLocation: State) =>
  (state: ?State = initialLocation, action: LocationChangedAction) => {
    if (action.type === LOCATION_CHANGED) {
      // No-op the initial route action
      if (
        state &&
        state.pathname === action.payload.pathname &&
        state.search === action.payload.search
      ) {
        return state;
      }

      // Extract the previous state, but dump the
      // previous state's previous state so that the
      // state tree doesn't keep growing indefinitely
      if (state) {
        // eslint-disable-next-line no-unused-vars
        const { previous, ...oldState } = state;

        const nextState = {
          ...action.payload,
          previous: oldState
        };

        // reuse the initial basename if not provided
        return oldState.basename ? {
          basename: oldState.basename,
          ...nextState
        } : nextState;
      }
    }
    return state;
  };
