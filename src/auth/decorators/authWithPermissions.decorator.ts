import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, PermissionGuard } from '../guards';
import { ISetPermissionsOptions } from '../interfaces';
import { SetPermissions } from './setPermissions.decorator';

export const AuthWithPermissions = (
  options: ISetPermissionsOptions = { permissions: [], strategy: 'matchSome' },
) => {
  return applyDecorators(
    SetPermissions(options),
    UseGuards(JwtAuthGuard, PermissionGuard),
  );
};
