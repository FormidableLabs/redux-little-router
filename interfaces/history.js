declare module 'history' {
  declare type Action = 'PUSH' | 'REPLACE' | 'POP';

  declare type Location = {
    pathname: string,
    search?: string,
    hash?: string,
    state?: Object,
    key?: string
  };

  declare type ListenCallback = (location: Location, action?: Action) => void;
  declare type BlockCallback = (location: Location, action?: Action) => string;
  declare type Unsubscribe = () => void;

  declare class History {
    length: number;
    location: Location;

    action: Action;

    listen(callback: ListenCallback): Unsubscribe;

    push(path: string, state?: Object): void;
    push(location: Location): void;
    replace(path: string, state?: Object): void;
    replace(location: Location): void;

    go(n: number): void;
    goBack(): void;
    goForward(): void;

    block(message: string): void;
    block(callback: BlockCallback): Unsubscribe;
  }

  declare class MemoryHistory extends History {
    index: number;
    entries: Array<string>;

    canGo(n: number): void;
  }

  declare type GetUserConfirmation = (
    message: string,
    callback: (continueTransition: bool) => void
  ) => void;

  declare type BrowserHistoryOptions = {|
    basename?: string,
    forceRefresh?: bool,
    keyLength?: number,
    getUserConfirmation: GetUserConfirmation;
  |};

  declare function createBrowserHistory(options?: BrowserHistoryOptions): History;

  declare type MemoryHistoryOptions = {|
    initialEntries?: Array<string>,
    initialIndex?: number,
    keyLength?: number,
    getUserConfirmation?: GetUserConfirmation
  |};

  declare function createMemoryHistory(options?: MemoryHistoryOptions): MemoryHistory;

  declare type HashType = 'slash' | 'noslash' | 'hashbang';

  declare type HashHistoryOptions = {|
    basename?: string,
    hashType?: HashType,
    getUserConfirmation?: GetUserConfirmation
  |};

  declare function createHashHistory(options?: HashHistoryOptions): History;

  declare function createLocation(
    path: string | Location,
    state?: any,
    key?: string,
    currentLocation?: Location
  ): Location;

  declare function locationsAreEqual(a: Location, b: Location): bool;

  declare function parsePath(path: string): Location;
  declare function createPath(location: Location): string;
}
