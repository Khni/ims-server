import { email } from "zod";
import { OtpType } from "../../../prisma/generated/prisma/index.js";
import prisma from "../../database/prisma.js";
import { CreateOtpSchema } from "../../shared/auth/schemas/index.js";
import { AuthDomainError } from "../errors/AuthDomainError.js";
import { generateRandomNumber } from "../../core/utils/generate-random-integer.js";
import bcrypt from "bcrypt";
import { generateExpiredDate } from "../../core/utils/generate-expired-date.js";
import MailSender from "../../core/mailer/mailer.service.js";
import { AuthUnexpectedError } from "../errors/AuthUnexpectedError.js";
export const createOtp = async (data: { email: string; otpType: OtpType }) => {
  try {
    CreateOtpSchema.parse({ email: data.email, type: data.otpType });
    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
      select: { password: true },
    });
    if (data.otpType === "VERIFY_EMAIL" && user) {
      throw new AuthDomainError(
        "AUTH_USED_EMAIL",
        `Email: ${email} is in used, Verify Email OTP can not be generated`
      );
    }
    if (
      (data.otpType === "FORGET_PASSWORD" || data.otpType === "LOGIN") &&
      !user
    ) {
      throw new AuthDomainError(
        "EMAIL_IS_NOT_EXIST",
        `Email: ${email} is not in  Database, ${OtpType} OTP can not be generated`
      );
    }
    if (data.otpType === "FORGET_PASSWORD" && !user?.password) {
      throw new AuthDomainError(
        "USER_NOT_LOCAL",
        `Email: ${email} is missing a local password, FORGET_PASSWORD OTP can not be generated`
      );
    }
    const expirationMinutes = 10;
    const generatedOtp = generateRandomNumber(101101, 989989);
    const hashedOtp = await bcrypt.hash(generatedOtp.toString(), 10);
    const expiredIn = generateExpiredDate(`${expirationMinutes}m`);
    const otpEmailTitle = data.otpType.replace("_", " ");

    const otp = await prisma.otp.create({
      data: {
        expiredIn,
        otp: hashedOtp,
        type: data.otpType,
        email: data.email,
      },
    });
    const mailer = new MailSender();
    await mailer.sendMailWithTemplate(
      data.email,
      otpEmailTitle,
      "otp-template",
      {
        otpType: otpEmailTitle,
        otp: generatedOtp,
        expirationMinutes,
        year: new Date().getFullYear(),
      }
    );
  } catch (error) {
    if (error instanceof AuthDomainError) {
      throw error;
    }
    throw new AuthUnexpectedError("OTP_CREATION_FAILED", error);
  }
};
