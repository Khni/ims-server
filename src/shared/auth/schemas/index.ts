import { z } from "zod";
import {
  LocalLoginInput,
  LocalRegisterInput,
  RefreshTokenInput,
  OtpEnum,
} from "../types/index.js";

export const registerBodySchema: z.ZodType<
  LocalRegisterInput,
  LocalRegisterInput
> = z.object({
  email: z.email({ message: "Invalid email address" }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(20, { message: "Password must be at most 20 characters" }),

  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" }),

  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" }),
});
export const loginBodySchema: z.ZodType<LocalLoginInput, LocalLoginInput> =
  z.object({
    email: z.email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(20, { message: "Password must be at most 20 characters" }),
  });

export const refreshTokenBodySchema: z.ZodType<RefreshTokenInput> = z.object({
  refreshToken: z
    .string()
    .length(80, "Refresh token must be 80 characters long")
    .optional(),
});

export const forgetPasswordBodySchema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"], // the error will show on confirmNewPassword
  });

/**
 * OTP
 */
export const CreateOtpSchema = z.object({
  email: z.email(),
  type: z.enum(OtpEnum),
});

export const VerifyOtpSchema = z.object({
  email: z.email(),
  type: z.enum(OtpEnum),
  otp: z.string().min(6),
});

/**
 * OAuth
 */

export const OAuthParamsCodeSchema = z.object({
  query: z.object({
    code: z.string(),
  }),
});
