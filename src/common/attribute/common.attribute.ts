import { ApiProperty } from '@nestjs/swagger';

/**
 * Common attributes for Supabase entities
 * Supabase automatically manages created_at and updated_at timestamps
 * These properties map to Supabase table columns
 */
export abstract class CommonAttribute {
  @ApiProperty({
    description: 'Created date (ISO 8601 format)',
    example: '2021-01-01T00:00:00.000Z',
  })
  created_at: Date | string;

  @ApiProperty({
    description: 'Updated date (ISO 8601 format)',
    example: '2021-01-01T00:00:00.000Z',
  })
  updated_at: Date | string;
}
