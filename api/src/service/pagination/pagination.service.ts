import { Injectable } from '@nestjs/common';

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface CursorPaginationOptions {
  cursor?: string;
  limit?: number;
}

export interface CursorPaginationMeta {
  nextCursor: string | null;
  hasNextPage: boolean;
}

export interface CursorPaginatedResult<T> {
  data: T[];
  meta: CursorPaginationMeta;
}

@Injectable()
export class PaginationService {
  /**
   * Calculates the skip and take values for database queries based on the requested page and limit.
   */
  getSkipTake(options: PaginationOptions): { skip: number; take: number } {
    const page = options.page > 0 ? options.page : 1;
    const limit = options.limit > 0 ? options.limit : 10;
    const skip = (page - 1) * limit;

    return { skip, take: limit };
  }

  /**
   * Formats the final paginated result payload with metadata.
   */
  paginate<T>(
    data: T[],
    totalItems: number,
    options: PaginationOptions,
  ): PaginatedResult<T> {
    const page = options.page > 0 ? options.page : 1;
    const limit = options.limit > 0 ? options.limit : 10;
    const totalPages = Math.ceil(totalItems / limit);

    return {
      data,
      meta: {
        totalItems,
        itemCount: data.length,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  /**
   * Formats the result for cursor-based (infinite scroll) pagination.
   * Assumes you fetch `limit + 1` items from the database to determine `hasNextPage`.
   */
  paginateCursor<T>(
    data: T[],
    options: CursorPaginationOptions,
    cursorExtractor: (item: T) => string,
  ): CursorPaginatedResult<T> {
    const limit = options.limit && options.limit > 0 ? options.limit : 10;

    // Check if we got an extra item (which indicates there is a next page)
    const hasNextPage = data.length > limit;

    // Slice off the extra item before returning
    const resultData = hasNextPage ? data.slice(0, limit) : data;

    // Get the cursor from the last item in the actual result set
    const nextCursor =
      hasNextPage && resultData.length > 0
        ? cursorExtractor(resultData[resultData.length - 1])
        : null;

    return {
      data: resultData,
      meta: {
        hasNextPage,
        nextCursor,
      },
    };
  }
}
