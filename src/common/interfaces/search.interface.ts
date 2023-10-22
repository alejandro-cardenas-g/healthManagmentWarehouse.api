import { FiltersValidator } from '../validators/filter.validator';
import { OrderValidator } from '../validators/order.validator';

export interface ISearchValidator<T> {
  page: number;
  query?: string[];
  filters?: FiltersValidator[];
  order: OrderValidator;
  // getFiltersConversion(requireValidation: boolean): Promise<T | null>;
}
