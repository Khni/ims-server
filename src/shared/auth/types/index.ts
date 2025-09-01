export type UserReturnType = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};
export type LocalRegisterInput = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};
export type LocalLoginInput = {
  email: string;
  password: string;
};

export type RefreshTokenInput = {
  refreshToken?: string;
};

export type RefreshTokenResponse = {
  accessToken: string;
};

/**
 * OTP
 */
export const OtpEnum = {
  VERIFY_EMAIL: "VERIFY_EMAIL",
  LOGIN: "LOGIN",
  FORGOT_PASSWORD: "FORGET_PASSWORD",
};
export type OtpType = "VERIFY_EMAIL" | "LOGIN" | "FORGET_PASSWORD";
export type CreateOtpBodyType = {
  email: string;
  type: OtpType;
};
export type VerifyOtpBodyType = {
  email: string;
  type: OtpType;
  otp: string;
};

/**
 * OAUTH
 */

export type OAuthParamsCode = {
  code: string;
};
