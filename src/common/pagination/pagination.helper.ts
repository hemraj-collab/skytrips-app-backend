import { PaginationInput, PaginatedResponse } from './index';

/**
 * Helper class for Supabase pagination
 * Provides utilities for paginated queries with Supabase
 */
export class SupabasePaginationHelper {
  /**
   * Apply pagination to a Supabase query
   * @param query - Supabase query builder
   * @param pagination - Pagination input parameters
   * @returns Modified query with pagination applied
   *
   * @example
   * const query = supabase.from('users').select('*');
   * const paginatedQuery = SupabasePaginationHelper.applyPagination(query, { page: 1, limit: 10 });
   */
  static applyPagination<T>(query: any, pagination: PaginationInput): any {
    const { from, to } = pagination.getRange();
    return query.range(from, to);
  }

  /**
   * Create a paginated response from Supabase query results
   * @param data - Array of items from Supabase
   * @param count - Total count from Supabase count query
   * @param pagination - Pagination input parameters
   * @returns Paginated response with metadata
   *
   * @example
   * const { data, count } = await supabase
   *   .from('users')
   *   .select('*', { count: 'exact' })
   *   .range(from, to);
   *
   * const response = SupabasePaginationHelper.createPaginatedResponse(
   *   data,
   *   count,
   *   { page: 1, limit: 10 }
   * );
   */
  static createPaginatedResponse<T>(
    data: T[],
    count: number | null,
    pagination: PaginationInput,
  ): PaginatedResponse<T> {
    return new PaginatedResponse<T>(
      data || [],
      count || 0,
      pagination.page,
      pagination.limit,
    );
  }

  /**
   * Execute a paginated Supabase query
   * Combines query execution with pagination logic
   * @param query - Supabase query builder (without pagination)
   * @param pagination - Pagination input parameters
   * @returns Paginated response with data and metadata
   *
   * @example
   * const query = supabase.from('users').select('*', { count: 'exact' });
   * const result = await SupabasePaginationHelper.executePaginatedQuery(
   *   query,
   *   { page: 1, limit: 10 }
   * );
   */
  static async executePaginatedQuery<T>(
    query: any,
    pagination: PaginationInput,
  ): Promise<PaginatedResponse<T>> {
    const { from, to } = pagination.getRange();

    const { data, count, error } = await query.range(from, to);

    if (error) {
      throw new Error(`Supabase query error: ${error.message}`);
    }

    return this.createPaginatedResponse<T>(data, count, pagination);
  }

  /**
   * Calculate total pages from total count
   * @param total - Total number of items
   * @param limit - Items per page
   * @returns Total number of pages
   */
  static calculateTotalPages(total: number, limit: number): number {
    return Math.ceil(total / limit);
  }

  /**
   * Validate pagination parameters
   * @param pagination - Pagination input to validate
   * @returns True if valid, throws error if invalid
   */
  static validatePagination(pagination: PaginationInput): boolean {
    if (pagination.page < 1) {
      throw new Error('Page number must be greater than 0');
    }
    if (pagination.limit < 1) {
      throw new Error('Limit must be greater than 0');
    }
    if (pagination.limit > 100) {
      throw new Error('Limit cannot exceed 100');
    }
    return true;
  }
}
