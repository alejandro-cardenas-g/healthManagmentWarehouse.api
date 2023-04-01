import { SetMetadata } from '@nestjs/common';
import { METADATA_PERMISSIONS } from '../constants';
import { ISetPermissionsOptions } from '../interfaces';

export const SetPermissions = (options: ISetPermissionsOptions) => {
  return SetMetadata(METADATA_PERMISSIONS, options);
};
