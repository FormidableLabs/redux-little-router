// @flow
import type { Location as HistoryLocation, BlockCallback } from 'history';

export type Query = { [key: string]: string };
export type Params = { [key: string]: string };

export type LocationOptions = {
  persistQuery?: boolean,
  updateRoutes?: boolean
};

export type Location = $Shape<
  HistoryLocation & {
    basename?: string,
    options?: LocationOptions,
    params?: Params,
    previous?: Location,
    query?: Query,
    result?: Object,
    routes?: Object,
    queue?: Array<Location>
  }
>;

export type State = {
  router: Location
};

export type Href = string | Location;

export const LOCATION_CHANGED = 'ROUTER_LOCATION_CHANGED';
export const PUSH = 'ROUTER_PUSH';
export const REPLACE = 'ROUTER_REPLACE';
export const GO = 'ROUTER_GO';
export const GO_BACK = 'ROUTER_GO_BACK';
export const GO_FORWARD = 'ROUTER_GO_FORWARD';
export const POP = 'ROUTER_POP';
export const BLOCK = 'ROUTER_BLOCK';
export const UNBLOCK = 'ROUTER_UNBLOCK';
export const REPLACE_ROUTES = 'ROUTER_REPLACE_ROUTES';
export const DID_REPLACE_ROUTES = 'ROUTER_DID_REPLACE_ROUTES';

const actionsWithPayload = [PUSH, REPLACE, GO, POP];
const actions = [
  ...actionsWithPayload,
  GO_FORWARD,
  GO_BACK,
  POP,
  BLOCK,
  UNBLOCK
];

export const isNavigationAction = (action: { type: $Subtype<string> }) =>
  actions.indexOf(action.type) !== -1;

export const isNavigationActionWithPayload = (action: {
  type: $Subtype<string>
}) => actionsWithPayload.indexOf(action.type) !== -1;

export type BareAction = {
  type: 'ROUTER_GO_BACK' | 'ROUTER_GO_FORWARD' | 'ROUTER_UNBLOCK'
};

export type FunctionAction = {
  type: 'ROUTER_BLOCK',
  payload: BlockCallback
};

export type IndexedAction = {
  type: 'ROUTER_GO',
  payload: number
};

export type LocationAction = {
  type: 'ROUTER_LOCATION_CHANGED' | 'ROUTER_PUSH' | 'ROUTER_REPLACE',
  payload: Location
};

export type RouterAction =
  | BareAction
  | FunctionAction
  | IndexedAction
  | LocationAction;
