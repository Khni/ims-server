import { IHasher } from "../../core/hasher/IHasher.js";
import { IMailSender } from "../../core/mailer/IMail.service.js";
import { OtpType } from "../../shared/auth/types/index.js";
import { AuthDomainError } from "../errors/AuthDomainError.js";
import { IOtpHelper } from "../interfaces/IOtpHelper.js";

export class OtpHelper implements IOtpHelper {
  constructor(
    private hasher: IHasher,
    private mailer: IMailSender,
    private otpConfig: { min: number; max: number } = {
      min: 101101,
      max: 989989,
    },
    private otpTemplateName: string = "otp-template"
  ) {
    if (this.otpConfig.min > otpConfig.max) {
      throw new Error("Min value cannot be greater than max value");
    }
  }
  validateOtp = async (
    otpRecord: { otp: string; expiredIn: Date } | null,
    otp: string
  ) => {
    if (!otpRecord) {
      throw new AuthDomainError("OTP_INVALID");
    }
    const isOtpValid = await this.hasher.compare(otp, otpRecord.otp);
    if (!isOtpValid) {
      throw new AuthDomainError("OTP_INVALID");
    }
    if (otpRecord.expiredIn < new Date()) {
      throw new AuthDomainError("OTP_EXPIRED");
    }
  };

  generateOtp = async () => {
    const min = Math.ceil(this.otpConfig.min);
    const max = Math.floor(this.otpConfig.min);
    const otp = Math.floor(Math.random() * (max - min + 1)) + min;
    const hashedOtp = await this.hasher.hash(otp.toString());
    return { otp: otp.toString(), hashedOtp };
  };

  validateOtpType = (
    otpType: OtpType,
    user: { password?: string | null } | null,
    email: string
  ) => {
    if (otpType === "VERIFY_EMAIL" && user) {
      throw new AuthDomainError(
        "AUTH_USED_EMAIL",
        `Email: ${email} is in used, Verify Email OTP can not be generated`
      );
    }
    if ((otpType === "FORGET_PASSWORD" || otpType === "LOGIN") && !user) {
      throw new AuthDomainError(
        "EMAIL_IS_NOT_EXIST",
        `Email: ${email} is not in Database, ${otpType} OTP can not be generated`
      );
    }
    if (otpType === "FORGET_PASSWORD" && !user?.password) {
      throw new AuthDomainError(
        "USER_NOT_LOCAL",
        `Email: ${email} is missing a local password, FORGET_PASSWORD OTP can not be generated`
      );
    }
  };

  sendOtpMail = async ({
    email,
    otpType,
    generatedOtp,
    otpExpiredInMinutes,
  }: {
    email: string;
    otpType: OtpType;
    generatedOtp: string;
    otpExpiredInMinutes: number;
  }) => {
    const otpEmailTitle = otpType.replace("_", " ");
    await this.mailer.sendMailWithTemplate(
      email,
      otpEmailTitle,
      this.otpTemplateName,
      {
        otpType: otpEmailTitle,
        otp: generatedOtp,
        otpExpiredInMinutes,
        year: new Date().getFullYear(),
      }
    );
  };
}
