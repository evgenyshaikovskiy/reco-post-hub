import {
  IsNull,
  Not,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  ILike,
  In,
} from 'typeorm';
import { FilterRule, IFiltering } from './filter.util';
import { ISorting } from './sorting.util';

export const getOrder = (sort: ISorting) =>
  sort ? { [sort.property]: sort.direction } : {};

export const getWhere = (filters: IFiltering[]) => {
  let clauses = {};
  for (let filter of filters) {
    if (!filter) continue;

    if (filter.rule == FilterRule.IS_NULL)
      clauses = { ...clauses, [filter.property]: IsNull() };
    if (filter.rule == FilterRule.IS_NOT_NULL)
      clauses = { ...clauses, [filter.property]: Not(IsNull()) };
    if (filter.rule == FilterRule.EQUALS)
      clauses = {...clauses, [filter.property]: filter.value}
    if (filter.rule == FilterRule.NOT_EQUALS)
      clauses = {...clauses, [filter.property]: Not(filter.value) };
    if (filter.rule == FilterRule.GREATER_THAN)
      clauses = {...clauses, [filter.property]: MoreThan(filter.value)};
    if (filter.rule == FilterRule.GREATER_THAN_OR_EQUALS)
      clauses = {...clauses, [filter.property]: MoreThanOrEqual(filter.value)};
    if (filter.rule == FilterRule.LESS_THAN)
      clauses = {...clauses, [filter.property]: LessThan(filter.value)};
    if (filter.rule == FilterRule.LESS_THAN_OR_EQUALS)
      clauses = {...clauses,[filter.property]: LessThanOrEqual(filter.value) };
    if (filter.rule == FilterRule.LIKE)
      clauses = {...clauses, [filter.property]: ILike(`%${filter.value}%`)};
    if (filter.rule == FilterRule.NOT_LIKE)
      clauses = {...clauses, [filter.property]: Not(ILike(`%${filter.value}%`))};
    if (filter.rule == FilterRule.IN)
      clauses = {...clauses, [filter.property]: In(filter.value.split(','))};
    if (filter.rule == FilterRule.NOT_IN)
      clauses = {...clauses, [filter.property]: Not(In(filter.value.split(',')))};
  }

  return clauses;
};

// const targetKeys = Object.keys(targetInterface) as (keyof U)[];
// const initialKeys = Object.keys(instance) as (keyof T)[];

// const mappedInstance = targetKeys.reduce((acc, key) => {
//   if (initialKeys.includes(key)) {
//     acc[key] = instance[key];
//   }
//   return acc;
// }, {} as U);

// return mappedInstance;
// }
