import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpResponseDto {
  @ApiProperty({
    example: true,
    description: 'Whether the OTP is valid',
  })
  valid: boolean;

  @ApiProperty({
    example: 'OTP verified successfully',
    description: 'Verification message',
  })
  message: string;

  @ApiProperty({
    example: '2026-01-02T12:00:00.000Z',
    description: 'Timestamp of verification',
  })
  verifiedAt: string;
}
