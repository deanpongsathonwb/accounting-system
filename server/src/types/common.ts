export interface DateRangeFilter {
  startDate?: string;
  endDate?: string;
}

export interface SortOptions {
  field: string;
  order: 'asc' | 'desc';
}

export interface FilterOptions {
  [key: string]: any;
}
