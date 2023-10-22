import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import { EAllowedPermissions } from '../constants/permissions.constant';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @Transform((v) =>
    typeof v.value === 'string' ? v.value.toLowerCase() : v.value,
  )
  email: string;

  @IsString()
  @MinLength(5)
  @MaxLength(50)
  @IsStrongPassword({
    minUppercase: 1,
    minNumbers: 1,
    minLength: 5,
    minLowercase: 1,
    minSymbols: 0,
  })
  password: string;

  @IsString({
    each: true,
  })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsNumber()
  @IsPositive()
  @IsOptional()
  templatePermissionId?: number;

  @IsArray()
  @IsEnum(EAllowedPermissions, { each: true })
  @IsOptional()
  permissions?: string[];
}
