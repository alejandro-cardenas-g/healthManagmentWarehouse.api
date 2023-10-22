import { Injectable } from '@nestjs/common';
import { UsersSearchValidator } from '../validators/users-search.validator';
import { UserRepository } from '../repositories/user.repository';
import { User } from 'src/auth/entities';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  buildMessage,
  isBooleanString,
} from 'class-validator';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  getSelectSearchBuilder() {
    return this.userRepository.getSelectSearchBuilder();
  }

  async searchUsers(params: UsersSearchValidator) {
    const { order, page, query = [] } = params;
    const filters = params.getFiltersConversion(false);
    const queryBuilder = this.userRepository.getSelectSearchBuilder();
    return { ok: true };
    // const builder = new SearchBuilder<User>(queryBuilder);
    // builder.addFields(["u.id", "u.email"])
    // builder.addOrder(order);
    // interface S{
    //   "u.isActive": boolean,
    // }
    // class Cuca{
    //   @IsBoolean({message: "active must be boolean"})
    //   @Transform((v) => isBooleanString(v.value) ? JSON.parse(v.value) : null )
    //   "u.isActive": boolean;
    // }
    // await builder.addFilters<S>(filters, {"active": "u.isActive"}, Cuca);
    // builder.addMatchQuery(query, ["u.email", "CONCAT(u.firstName, ' ', u.lastName)"]);
    // return builder.search();
  }
}
