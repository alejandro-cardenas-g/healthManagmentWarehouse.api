import { EAllowedPermissions } from '../constants';

export type SetPermissionsStrategy = 'matchSome' | 'matchAll';

export interface ISetPermissionsOptions {
  permissions: EAllowedPermissions[];
  strategy: SetPermissionsStrategy;
}
