import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordRequestDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address to send OTP',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;
}
