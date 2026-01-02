import { IsNumber, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/**
 * Pagination input for Supabase queries
 * Used with Supabase range() and limit() methods
 */
export class PaginationInput {
  @ApiProperty({
    description: 'Page number (1-based)',
    example: 1,
    required: false,
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    required: false,
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  /**
   * Calculate Supabase range values
   * Supabase uses zero-based range: range(from, to)
   */
  getRange(): { from: number; to: number } {
    const from = (this.page - 1) * this.limit;
    const to = from + this.limit - 1;
    return { from, to };
  }
}
