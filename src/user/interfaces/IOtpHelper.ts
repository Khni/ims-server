import { IHasher } from "../../core/hasher/IHasher.js";
import { OtpType } from "../../shared/auth/types/index.js";

export interface IOtpHelper {
  /**
   * Validate a provided OTP against a stored record
   * @throws AuthDomainError if OTP is invalid or expired
   */
  validateOtp(
    otpRecord: { otp: string; expiredIn: Date } | null,
    otp: string
  ): Promise<void>;

  /**
   * Generate a new OTP within the configured range and return both plain and hashed versions
   */
  generateOtp(): Promise<{ otp: string; hashedOtp: string }>;

  /**
   * Validate that the requested OTP type is allowed for the given user and email
   * @throws AuthDomainError if validation fails
   */
  validateOtpType(
    otpType: OtpType,
    user: { password?: string | null } | null,
    email: string
  ): void;
  sendOtpMail: ({
    email,
    otpType,
    generatedOtp,
    otpExpiredInMinutes,
  }: {
    email: string;
    otpType: OtpType;
    generatedOtp: string;
    otpExpiredInMinutes: number;
  }) => Promise<void>;
}

export interface OtpHelperConfig {
  min: number;
  max: number;
}

export interface OtpHelperConstructor {
  new (hasher: IHasher, otpConfig?: OtpHelperConfig): IOtpHelper;
}
