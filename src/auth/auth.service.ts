import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase';
import { SignupDto, LoginDto, AuthResponseDto } from './dto/auth.dto';
import {
  ForgotPasswordRequestDto,
  ForgotPasswordResponseDto,
  VerifyOtpRequestDto,
  VerifyOtpResponseDto,
  ResetPasswordRequestDto,
  ResetPasswordResponseDto,
} from './dto';

@Injectable()
export class AuthService {
  private otpStore = new Map<
    string,
    { otp: string; expiresAt: number; attempts: number }
  >();
  private readonly OTP_EXPIRY_MINUTES = 10;
  private readonly MAX_OTP_ATTEMPTS = 5;

  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Register a new user with email and password
   * @param signupDto User signup credentials
   * @returns User data and session
   */
  async signup(signupDto: SignupDto): Promise<AuthResponseDto> {
    const { email, password, fullName } = signupDto;

    const { data, error } = await this.supabaseService.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      throw new BadRequestException(error.message);
    }

    return {
      user: data.user,
      session: data.session,
    };
  }

  /**
   * Login user with email and password
   * @param loginDto User login credentials
   * @returns User data and session
   */
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    const { data, error } = await this.supabaseService.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    return {
      user: data.user,
      session: data.session,
    };
  }

  /**
   * Logout user by invalidating the session
   * @returns Success status
   */
  async logout(): Promise<{ message: string }> {
    const { error } = await this.supabaseService.auth.signOut();

    if (error) {
      throw new BadRequestException(error.message);
    }

    return { message: 'Logged out successfully' };
  }

  /**
   * Get current user from session
   * @param accessToken JWT access token
   * @returns Current user data
   */
  async getCurrentUser(accessToken: string) {
    const { data, error } =
      await this.supabaseService.auth.getUser(accessToken);

    if (error) {
      throw new UnauthorizedException(error.message);
    }

    return data.user;
  }

  /**
   * Generate a 6-digit OTP
   * @returns 6-digit OTP string
   */
  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Request password reset by sending OTP to user's email
   * @param forgotPasswordDto User email
   * @returns Success message
   */
  async forgotPassword(
    forgotPasswordDto: ForgotPasswordRequestDto,
  ): Promise<ForgotPasswordResponseDto> {
    const { email } = forgotPasswordDto;

    // Verify user exists
    const { data: users, error: fetchError } = await this.supabaseService
      .getClient()
      .from('users')
      .select('email')
      .eq('email', email)
      .limit(1);

    // Generate OTP
    const otp = this.generateOTP();
    const expiresAt = Date.now() + this.OTP_EXPIRY_MINUTES * 60 * 1000;

    // Store OTP in memory (consider using Redis for production)
    this.otpStore.set(email, {
      otp,
      expiresAt,
      attempts: 0,
    });

    // Send OTP via Supabase email (using password reset flow)
    // Note: You can customize this to send actual OTP email
    const { error } = await this.supabaseService.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${process.env.APP_HOST}:${process.env.APP_PORT}/auth/reset-password`,
      },
    );

    if (error) {
      // Don't reveal if user exists or not for security
      console.error('Password reset email error:', error.message);
    }

    // For demo purposes, log the OTP (remove in production)
    console.log(
      `OTP for ${email}: ${otp} (expires in ${this.OTP_EXPIRY_MINUTES} minutes)`,
    );

    return {
      message: 'If the email exists, an OTP has been sent',
      expiresIn: this.OTP_EXPIRY_MINUTES * 60,
      expiresAt: new Date(expiresAt).toISOString(),
    };
  }

  /**
   * Verify OTP code
   * @param verifyOtpDto Email and OTP
   * @returns Verification result
   */
  async verifyOtp(
    verifyOtpDto: VerifyOtpRequestDto,
  ): Promise<VerifyOtpResponseDto> {
    const { email, otp } = verifyOtpDto;

    const storedOtpData = this.otpStore.get(email);

    if (!storedOtpData) {
      throw new BadRequestException('OTP not found or expired');
    }

    // Check expiration
    if (Date.now() > storedOtpData.expiresAt) {
      this.otpStore.delete(email);
      throw new BadRequestException('OTP has expired');
    }

    // Check max attempts
    if (storedOtpData.attempts >= this.MAX_OTP_ATTEMPTS) {
      this.otpStore.delete(email);
      throw new BadRequestException('Maximum OTP attempts exceeded');
    }

    // Verify OTP
    if (storedOtpData.otp !== otp) {
      storedOtpData.attempts += 1;
      this.otpStore.set(email, storedOtpData);
      throw new UnauthorizedException(
        `Invalid OTP. ${this.MAX_OTP_ATTEMPTS - storedOtpData.attempts} attempts remaining`,
      );
    }

    return {
      valid: true,
      message: 'OTP verified successfully',
      verifiedAt: new Date().toISOString(),
    };
  }

  /**
   * Reset password using verified OTP
   * @param resetPasswordDto Email, OTP, and new password
   * @returns Success message
   */
  async resetPassword(
    resetPasswordDto: ResetPasswordRequestDto,
  ): Promise<ResetPasswordResponseDto> {
    const { email, otp, newPassword } = resetPasswordDto;

    // Verify OTP first
    await this.verifyOtp({ email, otp });

    // Get user by email
    const { data: userData, error: userError } =
      await this.supabaseService.auth.admin.listUsers();

    if (userError) {
      throw new BadRequestException('Failed to fetch user');
    }

    const user = userData.users.find((u: any) => u.email === email);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Update password using Supabase Admin API
    const { error: updateError } =
      await this.supabaseService.auth.admin.updateUserById(user.id, {
        password: newPassword,
      });

    if (updateError) {
      throw new BadRequestException(
        'Failed to update password: ' + updateError.message,
      );
    }

    // Clear OTP after successful password reset
    // Clear OTP after successful password reset
    this.otpStore.delete(email);

    return {
      message: 'Password reset successfully',
      resetAt: new Date().toISOString(),
    };
  }

  /**
   * Resend OTP for password reset
   * @param forgotPasswordDto User email
   * @returns Success message
   */
  async resendOtp(
    forgotPasswordDto: ForgotPasswordRequestDto,
  ): Promise<ForgotPasswordResponseDto> {
    const { email } = forgotPasswordDto;

    // Delete existing OTP
    this.otpStore.delete(email);

    // Generate and send new OTP
    return this.forgotPassword(forgotPasswordDto);
  }
}
