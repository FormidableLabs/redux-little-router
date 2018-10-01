// Type definitions for redux-little-router 15.0.0
// Project: https://github.com/FormidableLabs/redux-little-router
// Definitions by: priecint <https://github.com/priecint>
//                 parkerziegler <https://github.com/parkerziegler>
// TypeScript version: 2.4

import * as React from "react";
import { Reducer, Middleware, StoreEnhancer } from "redux";

export type ObjectLiteral<T> = { [key: string]: T };

export type Query = ObjectLiteral<string>;
export type Params = ObjectLiteral<string>;

/* check out https://basarat.gitbooks.io/typescript/docs/types/index-signatures.html to read more
about what is happening here. */
export type Routes = ObjectLiteral<ObjectLiteral<any>>;

export type LocationOptions = {
  persistQuery?: boolean;
  updateRoutes?: boolean;
};

export interface HistoryLocation {
  hash?: string,
  key?: string
  pathname?: string,
  search?: string,
  state?: ObjectLiteral<any>,
}

export interface Location extends HistoryLocation {
  basename?: string;
  options?: LocationOptions;
  params?: Params;
  previous?: Location;
  query?: Query;
  queue?: Array<Location>;
  result?: ObjectLiteral<any>;
  routes?: Routes;
}

export interface State {
  router: Location;
}

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

export type LocationChangedAction = {
  type: typeof LOCATION_CHANGED;
  payload: Location;
};
export type PushAction = {
  type: typeof PUSH;
  payload: Location;
}
export type ReplaceAction = {
  type: typeof REPLACE;
  payload: Location;
};
export type GoAction = {
  type: typeof GO;
  payload: number;
};
export type GoBackAction = {
  type: typeof GO_BACK;
};
export type GoForwardAction = {
  type: typeof GO_FORWARD;
};
export type BlockAction = {
  type: typeof BLOCK;
  payload: BlockCallback;
};
export type UnblockAction = {
  type: typeof UNBLOCK;
};
export type ReplaceRoutesAction = {
  type: typeof REPLACE_ROUTES;
  payload: {
    routes: Routes;
    options: {
      updateRoutes: boolean
    };
  };
};

export type RouterActions =
  | LocationChangedAction
  | PushAction
  | ReplaceAction
  | GoAction
  | GoBackAction
  | GoForwardAction
  | BlockAction
  | UnblockAction
  | ReplaceRoutesAction;

export function initializeCurrentLocation(location: Location): LocationChangedAction;

export function push(href: Href, options?: LocationOptions): PushAction;
export function replace(href: Href, options?: LocationOptions): ReplaceAction;
export function go(index: number): GoAction;
export function goBack(): GoBackAction;
export function goForward(): GoForwardAction;
export function block(historyShouldBlock: BlockCallback): BlockAction;
export function unblock(): UnblockAction;
export function replaceRoutes(routes: Routes): ReplaceRoutesAction;

type HistoryAction = 'PUSH' | 'POP' | 'REPLACE';
type ListenCallback = (location: Location, action?: HistoryAction) => void;
type BlockCallback = (location: Location, action?: HistoryAction) => string;
type Unsubscribe = () => void;

export interface History {
  length: number;
  location: Location;
  action: HistoryAction;
  listen(callback: ListenCallback): Unsubscribe;
  push(path: string, state?: ObjectLiteral<any>): void;
  push(location: Location): void;
  replace(path: string, state?: ObjectLiteral<any>): void;
  replace(location: Location): void;
  go(n: number): void;
  goBack(): void;
  goForward(): void;
  block(message: string): void;
  block(callback: BlockCallback): Unsubscribe;
}

export interface Router {
  reducer: Reducer<Location>;
  middleware: Middleware;
  enhancer: StoreEnhancer<Location>;
}

export interface BrowserRouterArgs {
  routes: Routes;
  basename?: string;
  history?: History;
}

export interface HashRouterArgs {
  routes: Routes;
  basename?: string;
  hashType?: string;
  history?: History;
}

export interface ExpressRouterArgs {
  routes: Routes;
  request: {
    path: string;
    baseUrl: string;
    url: string;
    query: ObjectLiteral<string>;
    passRouterStateToReducer?: boolean;
  };
}

export interface HapiRouterArgs {
  routes: Routes;
  request: {
    path: string;
    url: string;
    query: ObjectLiteral<string>;
  };
}

export function routerForBrowser(options: BrowserRouterArgs): Router;
export function routerForExpress(options: ExpressRouterArgs): Router;
export function routerForHapi(options: HapiRouterArgs): Router;
export function routerForHash(options: HashRouterArgs): Router;
export function immutableRouterForBrowser(options: BrowserRouterArgs): Router;
export function immutableRouterForExpress(options: ExpressRouterArgs): Router;
export function immutableRouterForHapi(options: HapiRouterArgs): Router;
export function immutableRouterForHash(options: HashRouterArgs): Router;

export interface LinkProps {
  className?: string;
  href: Href;
  persistQuery?: boolean;
  replaceState?: boolean;
  target?: string;
  onClick?: (event: Event) => any;
  style?: ObjectLiteral<any>;
  location?: Location;
  push?: (href: Href, options: LocationOptions) => {
    type: string;
    payload: Location;
  };
  replace?: (href: Href, options: LocationOptions) => {
    type: string;
    payload: Location;
  };
  activeProps?: ObjectLiteral<any>;
}

export declare class Link extends React.Component<LinkProps, {}> {}
export declare class ImmutableLink extends React.Component<LinkProps, {}> {}

export declare class PersistentQueryLink extends React.Component<LinkProps, {}> {}
export declare class ImmutablePersistentQueryLink extends React.Component<LinkProps, {}> {}

export interface FragmentProps {
  location?: Location;
  matchRoute?: Function;
  matchWildcardRoute?: Function;
  forRoute?: string;
  parentRoute?: string;
  withConditions?: (location: Location) => boolean;
  forNoMatch?: boolean;
  parentId?: string;
  style?: ObjectLiteral<any>;
}

export declare class Fragment extends React.Component<FragmentProps, {}> {}
export declare class ImmutableFragment extends React.Component<FragmentProps, {}> {}
