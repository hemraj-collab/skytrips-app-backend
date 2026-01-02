import { ApiProperty } from '@nestjs/swagger';
import { CommonAttribute } from 'src/common/attribute';

export class UserPassengerEntity extends CommonAttribute {
  static readonly tableName = 'user_passengers';
  @ApiProperty({
    description: 'Unique identifier (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Related User ID of the passenger (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  user_id: string;

  @ApiProperty({
    description: 'First name of the passenger',
    example: 'Bijaya',
  })
  first_name: string;

  @ApiProperty({
    description: 'Middle name of the passenger',
    example: 'Kumar',
    required: false,
  })
  middle_name?: string;

  @ApiProperty({
    description: 'Last name of the passenger',
    example: 'Bahadur',
  })
  last_name: string;

  @ApiProperty({
    description: 'Relationship of the passenger',
    example: 'Parent',
  })
  relationship: string;

  @ApiProperty({
    description: 'Date of birth of the passenger (ISO 8601 format)',
    example: '2020-01-01',
  })
  date_of_birth: string;

  @ApiProperty({
    description: 'Gender of the passenger',
    example: 'MALE',
    enum: ['MALE', 'FEMALE', 'OTHER'],
  })
  gender: string;

  @ApiProperty({
    description: 'Country of the passenger',
    example: 'Nepal',
  })
  country: string;

  @ApiProperty({
    description: 'Meal preference of the passenger',
    example: 'Vegetarian',
    required: false,
  })
  meal_preference?: string;

  @ApiProperty({
    description: 'Special assistance required by the passenger',
    example: 'Wheelchair',
    required: false,
  })
  special_assistance?: string;
}
