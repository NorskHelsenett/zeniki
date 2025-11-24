export interface VMwareNSXResponse<T> {
  sort_ascending?: boolean;
  sort_by?: string;
  result_count?: number;
  results: T[] | [];
}
