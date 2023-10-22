import { Expose, Transform } from 'class-transformer';
import { IsBoolean, isBooleanString } from 'class-validator';

export class UserSearchTransformValidator {
  @IsBoolean()
  @Transform(({ value }) =>
    isBooleanString(value) ? JSON.parse(value) : value,
  )
  @Expose()
  active: boolean;
}
