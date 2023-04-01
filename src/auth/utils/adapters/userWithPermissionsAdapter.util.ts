import { capitalize } from 'lodash';
import { Permission, User } from '../../entities';

export const userWithPermissionAdapter = (
  user: User,
  permissions: Permission[],
) => {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    companyId: user.companyId,
    profilePicture: user.profilePicture,
    fullName: capitalize(`${user.firstName} ${user.lastName}`),
    isRootUser: Boolean(user.isRootUser),
    permissions: permissions.map((permission) => permission.name),
  };
};
