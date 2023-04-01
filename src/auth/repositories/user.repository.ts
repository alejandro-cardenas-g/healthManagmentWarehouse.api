import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DB_CONNECTIONS } from '../../config/constants';
import { User } from '../entities';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(
    @InjectRepository(User, DB_CONNECTIONS.MAIN)
    dataAccess: Repository<User>,
  ) {
    super(User, dataAccess.manager, dataAccess.queryRunner);
  }

  getAuthInfo(id: string) {
    return this.findOne({
      where: { id },
      select: {
        id: true,
        companyId: true,
        email: true,
        isActive: true,
        isRootUser: true,
        tokenVersion: true,
      },
    });
  }

  revokeTokenVersion(userId: string, restart: boolean) {
    if (!restart) return this.increment({ id: userId }, 'tokenVersion', 1);
    return this.update(
      { id: userId },
      {
        tokenVersion: 0,
      },
    );
  }
}
