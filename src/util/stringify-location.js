// @flow
import type { Location } from 'history';
type LocationWithBasename = Location & { basename: string };
export default ({ basename, pathname, search }: LocationWithBasename) =>
  `${basename || ''}${pathname}${search || ''}`;
