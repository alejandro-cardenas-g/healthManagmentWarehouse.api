import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { EQuerySearchUserFields } from '../constants/query-search.constant';
import { IFiltersValidator } from 'src/common/interfaces/filters.interface';

export class UsersFilterValidator implements IFiltersValidator {
  @IsEnum(EQuerySearchUserFields)
  @IsNotEmpty()
  @IsString()
  key: string;

  @IsNotEmpty()
  value: unknown;
}
