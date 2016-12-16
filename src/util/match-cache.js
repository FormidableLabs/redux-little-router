// @flow

const ROUTE_FALLBACK = '@ROUTE_FALLBACK';

export class MatchCache {
  _data: { [parentId: string]: string };
  constructor() {
    this._data = {};
  }

  add(parentId: string, route: ?string) : void {
    this._data[parentId] = route || ROUTE_FALLBACK;
  }

  get(parentId: string) : null | string {
    return this._data[parentId] || null;
  }

  clear() : void {
    this._data = {};
  }
}

export default new MatchCache();
