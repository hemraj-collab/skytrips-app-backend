import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsEnum,
  IsString,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { IsNotEmpty } from 'class-validator';

export class CreateUserPassengerInput {
  @ApiProperty({
    description: 'First name of the passenger',
    example: 'Bijaya',
  })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({
    description: 'Middle name of the passenger',
    example: 'Kumar',
    required: false,
  })
  @IsOptional()
  @IsString()
  middle_name?: string;

  @ApiProperty({
    description: 'Last name of the passenger',
    example: 'Bahadur',
  })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({
    description: 'Relationship of the passenger',
    example: 'Parent',
  })
  @IsString()
  @IsNotEmpty()
  relationship: string;

  @ApiProperty({
    description: 'Date of birth of the passenger (ISO 8601 format)',
    example: '2020-01-01',
  })
  @IsString()
  @IsNotEmpty()
  date_of_birth: string;

  @ApiProperty({
    description: 'Gender of the passenger',
    example: 'MALE',
    enum: ['MALE', 'FEMALE', 'OTHER'],
  })
  @IsEnum(['MALE', 'FEMALE', 'OTHER'])
  @IsNotEmpty()
  gender: string;

  @ApiProperty({
    description: 'Country of the passenger',
    example: 'Nepal',
  })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({
    description: 'Meal preference of the passenger',
    example: 'Vegetarian',
    required: false,
  })
  @IsOptional()
  @IsString()
  meal_preference?: string;

  @ApiProperty({
    description: 'Special assistance required by the passenger',
    example: 'Wheelchair',
    required: false,
  })
  @IsOptional()
  @IsString()
  special_assistance?: string;
}
