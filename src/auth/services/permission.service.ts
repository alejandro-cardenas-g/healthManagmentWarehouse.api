import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DB_CONNECTIONS } from 'src/config/constants';
import { DataSource, In, Repository } from 'typeorm';
import { PermissionTemplate, UserPermission } from '../entities';
import { IPermissionStatusResponse } from '../interfaces/responses/permissionResponse.interface';
import {
  PermissionRepository,
  UserPermissionRepository,
} from '../repositories';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(PermissionTemplate, DB_CONNECTIONS.MAIN)
    private readonly permissionTemplateRepository: Repository<PermissionTemplate>,
    @InjectDataSource(DB_CONNECTIONS.MAIN)
    private readonly dataSource: DataSource,
    private readonly permissionRepository: PermissionRepository,
    private readonly userPermissionRepository: UserPermissionRepository,
  ) {}

  async applyPemissionsStrategy(
    permissionNames: string[] = [],
    userId: string,
    templatePayload: { templateId?: number; companyId: number },
  ): Promise<IPermissionStatusResponse> {
    if (templatePayload.templateId) {
      return this.applyPermissionsByTemplate(
        templatePayload.templateId,
        userId,
        templatePayload.companyId,
      );
    }
    return this.applyPermissions(permissionNames, userId);
  }

  async applyPermissions(
    permissionNames: string[],
    userId: string,
  ): Promise<IPermissionStatusResponse> {
    const response = { status: false };
    const [permissions, currentUserPermission] = await Promise.all([
      this.permissionRepository.find({
        where: {
          name: In([...permissionNames]),
        },
        select: { id: true },
      }),
      this.userPermissionRepository.find({ where: { userId } }),
    ]);
    const permissionsIds = permissions.map(({ id }) => id);
    const currentPermissionIds = currentUserPermission.map(
      ({ permissionId }) => permissionId,
    );
    const permissionsToAdd = permissionsIds.filter(
      (permissionId) => !currentPermissionIds.includes(permissionId),
    );
    const permissionsToDelete = currentPermissionIds.filter(
      (permissionId) => !permissionsIds.includes(permissionId),
    );

    const userPermissionToAdd = permissionsToAdd.map((permissionId) =>
      this.userPermissionRepository.create({ userId, permissionId }),
    );
    const userPermissionsIdsToDelete = currentUserPermission
      .filter(({ permissionId }) => permissionsToDelete.includes(permissionId))
      .map(({ id }) => id);

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.delete(UserPermission, {
        id: In(userPermissionsIdsToDelete),
      });
      await queryRunner.manager.save(userPermissionToAdd);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      response.status = true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
    } finally {
      return response;
    }
  }

  async applyPermissionsByTemplate(
    templateId: number,
    userId: string,
    companyId: number,
  ): Promise<IPermissionStatusResponse> {
    const permissionTemplate =
      await this.permissionTemplateRepository.findOneBy({
        id: templateId,
        companyId,
      });
    if (!permissionTemplate) return { status: false };
    return this.applyPermissions(permissionTemplate.permissions, userId);
  }

  async getUserPermissions(userId: string) {
    return this.permissionRepository.getUserPermissions(userId);
  }
}
