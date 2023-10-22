import { BadRequestException } from '@nestjs/common';
import { Type, plainToInstance, Expose } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  ValidateNested,
  validate,
} from 'class-validator';
import { AreValidFilters } from '../../common/decorators/validators/areValidFilters.decorator';
import { ISearchValidator } from '../../common/interfaces/search.interface';
import { OrderValidator } from '../../common/validators/order.validator';
import { UserSearchTransformValidator } from './user-search.transform.validator';
import { UsersFilterValidator } from './users-filter.validator';

export class UsersSearchValidator
  implements ISearchValidator<UserSearchTransformValidator>
{
  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  @Type(() => Number)
  page: number;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(5)
  @Type(() => String)
  query?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @AreValidFilters(UserSearchTransformValidator, { validateEachFilter: true })
  @Type(() => UsersFilterValidator)
  filters?: UsersFilterValidator[];

  @IsObject()
  @ValidateNested()
  @Type(() => OrderValidator)
  order: OrderValidator;

  async getFiltersConversion(requireValidation: boolean) {
    const plainObject: Partial<
      Record<keyof UserSearchTransformValidator, string>
    > = {};
    if (!this.filters) return null;
    for (const filter of this.filters) {
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
}
