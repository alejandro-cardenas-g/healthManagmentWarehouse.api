import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersSearchValidator } from '../validators/users-search.validator';
import { UserRepository } from '../repositories/user.repository';
import { User } from 'src/auth/entities';
import { Transform, Type, plainToInstance } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  buildMessage,
  isBooleanString,
  validate,
} from 'class-validator';
import { UserSearchTransformValidator } from '../validators/user-search.transform.validator';
import {
  legacyFieldsSchema,
  userSearchSchema,
} from '../schemas/search/user-search.schema';
import {
  EqualFilter,
  MatchFilter,
} from '../../common/classes/searchBuilder.v2.class';
import { FiltersValidator } from '../../common/validators/filter.validator';

@Injectable()
export class UsersSearchService {
  constructor(private readonly userRepository: UserRepository) {}

  getSelectSearchBuilder() {
    return this.userRepository.getSelectSearchBuilder();
  }

  async getFiltersConversion(
    requireValidation: boolean,
    filters: FiltersValidator[],
  ): Promise<UserSearchTransformValidator | null> {
    const plainObject: Partial<
      Record<keyof UserSearchTransformValidator, string>
    > = {};
    if (!filters.length) return null;
    for (const filter of filters) {
      const { key, value: nValue } = filter;
      plainObject[key] = nValue;
    }
    const filterInstance = plainToInstance(
      UserSearchTransformValidator,
      plainObject,
    );
    if (requireValidation) {
      const errors = await validate(filterInstance);
      if (errors.length) throw new BadRequestException(errors);
    }
    return filterInstance;
  }

  getFilters(userFilterEntity: UserSearchTransformValidator | null) {
    const equalFilters: EqualFilter[] = [];
    if (!userFilterEntity) return equalFilters;
    for (const [key, value] of Object.entries(userFilterEntity)) {
      const validKey = userSearchSchema[key];
      if (!validKey) continue;
      equalFilters.push(new EqualFilter(validKey, value));
    }
    return equalFilters;
  }

  getTerms(terms: string[], fields: string[]) {
    if (!terms.length) return [];
    return fields.map((field) => new MatchFilter<string>(field, terms));
  }

  getLegacyFilters(companyId: number, userId: string) {
    return [
      new EqualFilter<number>(legacyFieldsSchema.companyId, companyId),
      new EqualFilter<string>(legacyFieldsSchema.userId, userId, 'NO'),
    ];
  }
}
