import { SelectQueryBuilder, Brackets } from 'typeorm';
import { OrderValidator } from '../validators/order.validator';
import { FiltersValidator } from '../validators/filter.validator';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { validate } from 'class-validator';

// interface Options<K>{
//   filtersOptions: {
//     filters: FiltersValidator[],
//     schema: Record<string, keyof K>,
//     transformer?: ClassConstructor<K>
//   },
//   queryOptions: {
//     query: string[],
//     matchFields: string[]
//   },
//   fields: string[],
//   order: OrderValidator
// }

export abstract class Filter<T> {
  constructor(protected name: string, protected value: T) {}

  getField() {
    return this.name;
  }

  getValue() {
    return this.value;
  }
}

export class EqualFilter<T = unknown> extends Filter<T> {
  protected operator: 'YES' | 'NO';
  constructor(name: string, value: T, operator: 'YES' | 'NO' = 'YES') {
    super(name, value);
    this.operator = operator;
  }

  getOperator() {
    return this.operator;
  }
}

export class MatchFilter<T = unknown> extends Filter<T[]> {
  constructor(name: string, value: T[]) {
    super(name, value);
  }
}

export class SearchBuilder<T> {
  private builder: SelectQueryBuilder<T>;
  private equalFilters: EqualFilter[] = [];
  private matchFilters: MatchFilter[] = [];
  private order: OrderValidator;
  private fields: string[];
  private page: number;
  private pageSize: number;

  private firstWhere: boolean = false;

  constructor(selectQueryBuilder: SelectQueryBuilder<T>) {
    this.builder = selectQueryBuilder;
  }

  addEqualFilters(filters: EqualFilter[]) {
    this.equalFilters = filters;
  }
  addMatchFilters(filters: MatchFilter[]) {
    this.matchFilters = filters;
  }

  addOrder(order: OrderValidator) {
    this.order = order;
  }

  addFields(fields: string[]) {
    this.fields = fields;
  }

  addPagination(page: number, pageSize: number) {
    if (pageSize <= 0)
      throw new InternalServerErrorException('PageSize must be higher than 0');
    if (page <= 0)
      throw new InternalServerErrorException('Page must be higher than 0');
    this.page = page;
    this.pageSize = pageSize;
  }

  search(): Promise<T[]> {
    this.builder.select(this.fields);
    if (this.equalFilters.length) this.buildEqualFilters();
    if (this.matchFilters.length) this.buildMatchFilters();
    this.buildOrder();
    this.buildPagination();
    return this.builder.getMany();
  }

  count(): Promise<number> {
    this.builder.select(this.fields);
    if (this.equalFilters.length) this.buildEqualFilters();
    if (this.matchFilters.length) this.buildMatchFilters();
    return this.builder.getCount();
  }

  private buildEqualFilters() {
    for (const equalFilter of this.equalFilters) {
      const operator = equalFilter.getOperator() === 'YES' ? '=' : '<>';
      const field = equalFilter.getField();
      const filterQuery = `${field} ${operator} :${field}`;
      const equalValue = equalFilter.getValue();
      if (!this.firstWhere) {
        this.builder.where(filterQuery, { [field]: equalValue });
        this.firstWhere = true;
        continue;
      }
      this.builder.andWhere(filterQuery, { [field]: equalValue });
    }
  }

  private buildMatchFilters() {
    let termCounter = 1;
    if (this.equalFilters.length > 0) {
      const insideWhereClause = new Brackets((qb) => {
        let firstInsideWhere: boolean = false;
        for (const matchFilter of this.matchFilters) {
          const field = matchFilter.getField();
          const terms = matchFilter.getValue();
          for (const term of terms) {
            const matchValue = `matchValue${termCounter}`;
            termCounter++;
            const matchTerm = `%${term}%`;
            const matchQuery = `${field} ilike :${matchValue}`;
            if (!firstInsideWhere) {
              qb.where(matchQuery, { [matchValue]: matchTerm });
              firstInsideWhere = true;
              continue;
            }
            qb.orWhere(matchQuery, { [matchValue]: matchTerm });
          }
        }
        return qb;
      });
      this.builder.andWhere(insideWhereClause);
    } else {
      for (const matchFilter of this.matchFilters) {
        const field = matchFilter.getField();
        const terms = matchFilter.getValue();
        for (const term of terms) {
          const matchValue = `matchValue${termCounter}`;
          termCounter++;
          const matchTerm = `%${term}%`;
          const matchQuery = `${field} ilike :${matchValue}`;
          if (!this.firstWhere) {
            this.builder.where(matchQuery, { [matchValue]: matchTerm });
            this.firstWhere = true;
            continue;
          }
          this.builder.orWhere(matchQuery, { [matchValue]: matchTerm });
        }
      }
    }
  }

  private buildOrder() {
    const { by, type } = this.order;
    this.builder.orderBy({ [by]: type });
  }

  private buildPagination() {
    if (!this.page || !this.pageSize) return;
    this.builder.take(this.pageSize);
    this.builder.skip(this.page - 1);
  }
}
