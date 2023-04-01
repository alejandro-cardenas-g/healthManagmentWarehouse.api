import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { METADATA_PERMISSIONS } from '../constants';
import {
  IAuthUser,
  ISetPermissionsOptions,
  SetPermissionsStrategy,
} from '../interfaces';

type roleFunction = (
  permissions: string[],
  userPermissions: string[],
) => boolean;

interface IPermissionGuardStrategy {
  validateMatchAllStrategy: roleFunction;
  validateMatchSomeStrategy: roleFunction;
}

@Injectable()
export class PermissionGuard implements CanActivate, IPermissionGuardStrategy {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const { permissions = [], strategy = 'matchSome' } =
      this.reflector.get<ISetPermissionsOptions>(
        METADATA_PERMISSIONS,
        context.getHandler(),
      );
    if (permissions.length === 0) return true;
    const req = context.switchToHttp().getRequest();
    const user = req.user as IAuthUser;
    if (!user)
      throw new InternalServerErrorException('User not found (request)');
    if (user.isRootUser) return true;
    const handleValidation = this.setStrategy(strategy);
    const validation = handleValidation(permissions, user.permissions || []);
    if (!validation) {
      const message: Record<SetPermissionsStrategy, string> = {
        matchAll: 'Los siguientes permisos son necesarios',
        matchSome: 'Alguno de los siguientes roles es necesario',
      };
      throw new ForbiddenException(
        `No tienes permiso para realizar esta operación. ${message[strategy]}: [${permissions}]`,
      );
    }
    return validation;
  }

  private setStrategy(strategy: SetPermissionsStrategy): roleFunction {
    switch (strategy) {
      case 'matchAll':
        return this.validateMatchAllStrategy;
      case 'matchSome':
        return this.validateMatchSomeStrategy;
      default:
        throw new InternalServerErrorException('Strategy not implemented');
    }
  }

  validateMatchAllStrategy(permissions: string[], userPermissions: string[]) {
    return permissions.every((permission) =>
      userPermissions.includes(permission),
    );
  }
  validateMatchSomeStrategy(permissions: string[], userPermissions: string[]) {
    return permissions.some((permission) =>
      userPermissions.includes(permission),
    );
  }
}
