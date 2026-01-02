import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordResponseDto {
  @ApiProperty({
    example: 'Password reset successfully',
    description: 'Success message',
  })
  message: string;

  @ApiProperty({
    example: '2026-01-02T12:00:00.000Z',
    description: 'Timestamp of password reset',
  })
  resetAt: string;
}
