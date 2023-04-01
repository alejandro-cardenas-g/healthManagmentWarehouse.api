import {
  Body,
  Controller,
  InternalServerErrorException,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../decorators/get-user.decorator';
import { JwtAuthGuard } from '../guards/jwtAuth.guard';
import { UpdateUserPermissionsDto } from '../dto';
import { PermissionService, UserService } from '../services';

@Controller('user-permission')
export class UserPermissionController {
  constructor(
    private readonly permissionService: PermissionService,
    private readonly userService: UserService,
  ) {}

  @Patch(':userId')
  @UseGuards(JwtAuthGuard)
  async updateUserPermission(
    @Body() updateUserPermissionsDto: UpdateUserPermissionsDto,
    @Param('userId', ParseUUIDPipe) userId: string,
    @GetUser('companyId') companyId: number,
  ) {
    const { permissions = [], templatePermissionId } = updateUserPermissionsDto;
    const user = await this.userService.getUser(userId, companyId);
    const { status } = await this.permissionService.applyPemissionsStrategy(
      permissions,
      user.id,
      { templateId: templatePermissionId, companyId },
    );
    if (!status)
      throw new InternalServerErrorException(
        'Error al actualizar los permisos',
      );
    return this.permissionService.getUserPermissions(userId);
  }
}
