import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordResponseDto {
  @ApiProperty({
    example: 'If the email exists, an OTP has been sent',
    description: 'Response message',
  })
  message: string;

  @ApiProperty({
    example: 600,
    description: 'OTP expiration time in seconds',
  })
  expiresIn: number;

  @ApiProperty({
    example: '2026-01-02T12:00:00.000Z',
    description: 'OTP expiration timestamp',
  })
  expiresAt: string;
}
