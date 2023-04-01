export const METADATA_PERMISSIONS = 'permissions';

export enum EAllowedPermissions {
  ListUsers = 'user-read-list',
  ReadUser = 'user-read-single',
  DeleteUser = 'user-delete',
  EditBasicUser = 'user-edit-basic',
  CreateUser = 'user-create',
  UpdatePermissionsUser = 'user-edit-permissions',
}
