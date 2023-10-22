import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DB_CONNECTIONS } from '../../config/constants';
import { User } from '../../auth/entities';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(
    @InjectRepository(User, DB_CONNECTIONS.MAIN)
    dataAccess: Repository<User>,
  ) {
    super(User, dataAccess.manager, dataAccess.queryRunner);
  }

  getSelectSearchBuilder() {
    return this.createQueryBuilder('u');
  }
}
