import { BadRequestException } from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import {
  ValidationArguments,
  ValidationError,
  registerDecorator,
  validate,
} from 'class-validator';
import { isEmpty } from 'lodash';
import { FiltersValidator } from 'src/common/validators/filter.validator';

interface AreValidFiltersOptions {
  validateEachFilter?: boolean;
}

export function AreValidFilters<T extends object, K>(
  validator: ClassConstructor<T>,
  options?: AreValidFiltersOptions,
) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      name: 'IsValidUserQuerySearch',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [options],
      options: {},
      validator: {
        async validate(value: FiltersValidator[], args: ValidationArguments) {
          const [options] = args.constraints;
          const { validateEachFilter = false } =
            options as AreValidFiltersOptions;
          if (!value.length) throw new BadRequestException();
          const plainObject: Partial<Record<keyof T, string>> = {};
          for (const filter of value) {
            if (validateEachFilter) {
              const filterError = await validate(filter);
              if (filterError.length)
                throw new BadRequestException(filterError);
            }
            const { key, value: nValue } = filter;
            plainObject[key] = nValue;
          }
          const transformFilters = plainToInstance(validator, plainObject, {
            excludeExtraneousValues: true,
          });
          if (isEmpty(transformFilters))
            throw new BadRequestException({
              value,
              property: '*',
              constraints: {
                invalid: 'invalid properties',
              },
            } as ValidationError);
          const errors = await validate(transformFilters);
          if (errors.length) throw new BadRequestException(errors);
          return true;
        },
      },
    });
  };
}
