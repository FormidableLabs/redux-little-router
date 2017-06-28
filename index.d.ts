// Type definitions for redux-little-router 14.0.0
// Project: https://github.com/FormidableLabs/redux-little-router
// Definitions by: priecint <https://github.com/priecint>

import {Reducer, Middleware, StoreEnhancer} from "redux";
// import React, {Component} from "react";

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
};

export type Query = { [key: string]: string };
export type Params = { [key: string]: string };

export type Location = {
  basename?: string;
  options?: LocationOptions;
  params?: Params;
  previous?: Location;
  query?: Query;
  result?: {};
};

interface BrowserRouterOptions {
  routes: Routes;
  basename: string;
}

export function routerForBrowser(options: BrowserRouterOptions): {
  reducer: Reducer<Location>;
  middleware: Middleware;
  enhancer: StoreEnhancer<Location>;
};

interface ServerRouterOptions {
  routes: Routes;
  request: {
    path: string;
    baseUrl: string;
    url: string;
    query: {
      [key: string]: string;
    }
  };
}

export function routerForExpress(options: ServerRouterOptions): {
  reducer: Reducer<Location>;
  middleware: Middleware;
  enhancer: StoreEnhancer<Location>;
};

interface HapiRouterOptions {
  routes: Routes;
  request: {
    path: string;
    url: string;
    query: {
      [key: string]: string;
    }
  };
}

export function routerForHapi(options: HapiRouterOptions): {
  reducer: Reducer<Location>;
  middleware: Middleware;
  enhancer: StoreEnhancer<Location>;
};

export function initializeCurrentLocation(location: Location): {
  type: string;
  payload: Location;
}

export type Href = string | Location;

export function push(href: Href, options: LocationOptions): {
  type: string;
  payload: Location & {
    state: {
      reduxLittleRouter: {
        // [index: string]: any;
        query: {};
        options: LocationOptions;
      };
    };
  };
}

export function replace(href: Href, options: LocationOptions): {
  type: string;
  payload: Location & {
    state: {
      reduxLittleRouter: {
        // [index: string]: any;
        query: {};
        options: LocationOptions;
      };
    };
  };
}

export function go(index: number): {
  type: string;
  payload: number;
}

export function goBack(): {
  type: string;
}

export function goForward(): {
  type: string;
}

export const LOCATION_CHANGED: string;
export const PUSH: string;
export const REPLACE: string;
export const GO: string;
export const GO_BACK: string;
export const GO_FORWARD: string;

// // namespace Link {
// interface LinkProps {
//   children: React.Element<*>;
//   className: string;
//   href: Href;
//   persistQuery: boolean;
//   replaceState: boolean;
//   target: string;
//   onClick: EventHandler;
//   style: Object;
//   location: Location;
//   push: Function;
//   replace: Function;
// }
// // }
//
// export class Link extends React.Component<LinkProps> {
// }
