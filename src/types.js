// @flow
import type { Location as HistoryLocation } from 'history';

export type Query = { [key: string]: string };
export type Params = { [key: string]: string };

export type LocationOptions = {
  persistQuery?: boolean
};

export type Location = $Shape<HistoryLocation & {
  basename?: string,
  options?: LocationOptions,
  params?: Params,
  previous?: Location,
  query?: Query,
  result?: Object,
  queue?: Array<Location>
}>;

export type Href = string | Location;

export const LOCATION_CHANGED = 'ROUTER_LOCATION_CHANGED';
export const PUSH = 'ROUTER_PUSH';
export const REPLACE = 'ROUTER_REPLACE';
export const GO = 'ROUTER_GO';
export const GO_BACK = 'ROUTER_GO_BACK';
export const GO_FORWARD = 'ROUTER_GO_FORWARD';
export const POP = 'ROUTER_POP';

export const isNavigationAction = (action: { type: $Subtype<string> }) =>
  [PUSH, REPLACE, GO, GO_BACK, GO_FORWARD, POP].indexOf(action.type) !== -1;

export type BareAction = {
  type: 'ROUTER_GO_BACK' | 'ROUTER_GO_FORWARD'
};

export type IndexedAction = {
  type: 'ROUTER_GO',
  payload: number
};

export type LocationAction = {
  type: 'ROUTER_LOCATION_CHANGED' | 'ROUTER_PUSH' | 'ROUTER_REPLACE',
  payload: Location
};

export type RouterAction = BareAction | IndexedAction | LocationAction;
