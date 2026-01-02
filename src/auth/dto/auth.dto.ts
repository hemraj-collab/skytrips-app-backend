import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'SecurePassword123!',
    description: 'User password (min 6 characters)',
  })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @ApiPropertyOptional({ example: 'John Doe', description: 'User full name' })
  @IsOptional()
  @IsString()
  fullName?: string;
}

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecurePassword123!', description: 'User password' })
  @IsString()
  @MinLength(6)
  password: string;
}

export class SessionDto {
  @ApiProperty({
    description: 'JWT access token for authentication',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: 'JWT refresh token for renewing access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refresh_token: string;

  @ApiProperty({
    description: 'Token type',
    example: 'bearer',
  })
  token_type?: string;

  @ApiProperty({
    description: 'Token expiration time in seconds',
    example: 3600,
  })
  expires_in?: number;

  @ApiProperty({
    description: 'Token expiration timestamp',
    example: 1735819200,
  })
  expires_at?: number;
}

export class UserDto {
  @ApiProperty({
    description: 'User unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  email?: string;

  @ApiProperty({
    description: 'Email confirmation status',
    example: true,
  })
  email_confirmed_at?: string;

  @ApiProperty({
    description: 'User metadata',
    example: { full_name: 'John Doe' },
  })
  user_metadata?: any;

  @ApiProperty({
    description: 'User created timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  created_at?: string;
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'Authenticated user information',
    type: UserDto,
  })
  user: UserDto;

  @ApiProperty({
    description: 'Session with JWT access and refresh tokens',
    type: SessionDto,
  })
  session: SessionDto;
}
