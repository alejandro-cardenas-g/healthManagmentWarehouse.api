import { registerDecorator, ValidationOptions, ValidationArguments, isEmail } from 'class-validator';
import { EQuerySearchUserFields } from 'src/users/constants/query-search.constant';
import { UsersFilterValidator } from 'src/users/validators/users-filter.validator';

export function IsValidUserQuerySearch(validationOptions?: ValidationOptions) {
  return function (object: UsersFilterValidator, propertyName: string) {
    registerDecorator({
      name: 'IsValidUserQuerySearch',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return true;
        },
      },
    });
  };
}