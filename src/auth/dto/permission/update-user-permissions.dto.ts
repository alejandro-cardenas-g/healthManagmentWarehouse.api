import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';
import { EAllowedPermissions } from '../../constants/permissions.constant';

export class UpdateUserPermissionsDto {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  templatePermissionId?: number;

  @IsArray()
  @IsEnum(EAllowedPermissions, { each: true })
  @IsOptional()
  permissions?: string[];
}
