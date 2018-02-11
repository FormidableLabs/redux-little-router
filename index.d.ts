// Type definitions for redux-little-router 15.0.0
// Project: https://github.com/FormidableLabs/redux-little-router
// Definitions by: priecint <https://github.com/priecint>
//                 parkerziegler <https://github.com/parkerziegler>
// TypeScript version: 2.4

import * as React from "react";
import { Action, Reducer, Middleware, StoreEnhancer } from "redux";

export type Query = { [key: string]: string };
export type Params = { [key: string]: string };

export interface Routes {
  [index: string]: {
    [index: string]: RouteDefinition;
  };
}

export interface RouteDefinition {
  [index: string]: string | RouteDefinition;
}

export type LocationOptions = {
  persistQuery?: boolean;
  updateRoutes?: boolean;
};

export interface HistoryLocation {
  hash?: string,
  key?: string
  pathname: string,
  search?: string,
  state?: {},
}

export interface Location extends HistoryLocation {
  basename?: string;
  options?: LocationOptions;
  params?: Params;
  previous?: Location;
  query?: Query;
  queue?: Array<Location>;
  result?: {};
  routes?: {};
}

export interface State {
  router: Location;
}

export type Href = string | Location;

export const LOCATION_CHANGED: string;
export const PUSH: string;
export const REPLACE: string;
export const GO: string;
export const GO_BACK: string;
export const GO_FORWARD: string;
export const POP: string;
export const REPLACE_ROUTES: string;
export const DID_REPLACE_ROUTES: string;

export function push(href: Href, options: LocationOptions): {
  type: string;
  payload: Location;
}

export function replace(href: Href, options: LocationOptions): {
  type: string;
  payload: Location;
}

export function go(index: number): {
  type: string;
  payload: number;
};

export function goBack(): {
  type: string;
}

export function goForward(): {
  type: string;
}

export function locationDidChange(location: Location): {
  type: string;
  payload: Location;
};

export function initializeCurrentLocation(location: Location): {
  type: string;
  payload: Location;
};

export function replaceRoutes(routes: {}): {
  type: string;
  payload: {
    routes: {};
    options: {
      updateRoutes: boolean
    };
  }
};

export function didReplaceRoutes(): {
  type: string
};

type ListenCallback = (location: Location, action?: Action) => void;
type BlockCallback = (location: Location, action?: Action) => string;
type Unsubscribe = () => void;

export interface History {
  length: number;
  location: Location;
  action: Action;
  listen(callback: ListenCallback): Unsubscribe;
  push(path: string, state?: {}): void;
  push(location: Location): void;
  replace(path: string, state?: {}): void;
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
  routes: {};
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
    query: {
      [key: string]: string;
    };
    passRouterStateToReducer?: boolean;
  };
}

export interface HapiRouterArgs {
  routes: Routes;
  request: {
    path: string;
    url: string;
    query: {
      [key: string]: string;
    }
  };
}

export function routerForBrowser(options: BrowserRouterArgs): Router;
export function routerForExpress(options: ExpressRouterArgs): Router;
export function routerForHapi(options: HapiRouterArgs): Router;
export function routerForHash(options: HashRouterArgs): Router;

export interface LinkProps {
  className?: string;
  href: Href;
  persistQuery?: boolean;
  replaceState?: boolean;
  target?: string;
  onClick?: (event: Event) => any;
  style?: {};
  location?: Location;
  push?: (href: Href, options: LocationOptions) => {
    type: string;
    payload: Location;
  };
  replace?: (href: Href, options: LocationOptions) => {
    type: string;
    payload: Location;
  };
  activeProps?: {};
}

export declare class Link extends React.Component<LinkProps, any> {}

export declare class PersistentQueryLink extends React.Component<LinkProps, any> {}

export interface FragmentProps {
  location?: Location;
  matchRoute?: Function;
  matchWildcardRoute?: Function;
  forRoute?: string;
  parentRoute?: string;
  withConditions?: (location: Location) => boolean;
  forNoMatch?: boolean;
  parentId?: string;
  style?: {};
}

export declare class Fragment extends React.Component<FragmentProps, any> {}
