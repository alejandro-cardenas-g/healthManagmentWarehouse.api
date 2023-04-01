import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DB_CONNECTIONS } from '../../config/constants';
import { Permission } from '../entities';

@Injectable()
export class PermissionRepository extends Repository<Permission> {
  constructor(
    @InjectRepository(Permission, DB_CONNECTIONS.MAIN)
    dataAccess: Repository<Permission>,
  ) {
    super(Permission, dataAccess.manager, dataAccess.queryRunner);
  }

  getUserPermissions(userId: string) {
    return this.createQueryBuilder('p')
      .select(['p.name', 'p.id'])
      .leftJoin('p.userPermissions', 'up')
      .where('up.userId = :userId', { userId })
      .getMany();
  }
}
