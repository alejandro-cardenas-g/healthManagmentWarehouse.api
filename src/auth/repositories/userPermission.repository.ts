import { InjectRepository } from '@nestjs/typeorm';
import { DB_CONNECTIONS } from 'src/config/constants';
import { Repository } from 'typeorm';
import { UserPermission } from '../entities';

export class UserPermissionRepository extends Repository<UserPermission> {
  constructor(
    @InjectRepository(UserPermission, DB_CONNECTIONS.MAIN)
    dataAccess: Repository<UserPermission>,
  ) {
    super(UserPermission, dataAccess.manager, dataAccess.queryRunner);
  }

  getByUserIdWithPermissions(userId: string) {
    return this.find({
      where: {
        userId,
      },
      relations: { permission: true },
      select: {
        id: true,
        permission: {
          id: true,
          name: true,
        },
      },
    });
  }
}
