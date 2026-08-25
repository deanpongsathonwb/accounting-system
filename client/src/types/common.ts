export type Gender = 'male' | 'female' | 'other';

export type StatusFilter = 'all' | 'present' | 'late' | 'absent' | 'leave';

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}
