import { OtpType } from "../../../prisma/generated/prisma/index.js";
import prisma from "../../database/prisma.js";
import {
  CreateOtpSchema,
  VerifyOtpSchema,
} from "../../shared/auth/schemas/index.js";
import { AuthDomainError } from "../errors/AuthDomainError.js";
import { generateRandomNumber } from "../../core/utils/generate-random-integer.js";
import bcrypt from "bcrypt";
import { generateExpiredDate } from "../../core/utils/generate-expired-date.js";
import MailSender from "../../core/mailer/mailer.service.js";
import { AuthUnexpectedError } from "../errors/AuthUnexpectedError.js";
import { IOtpRepository } from "../interfaces/IOtpRepository.js";
import { IHasher } from "../../core/hasher/IHasher.js";
import { IMailSender } from "../../core/mailer/IMail.service.js";
import { ValidTimeString } from "../../core/utils/types.js";
import { IUserRepository } from "../interfaces/IUserRepository.js";
import { IToken } from "../../core/token/IToken.js";
import { IOtpHelper } from "../interfaces/IOtpHelper.js";

export class OtpService {
  constructor(
    private otpRepository: IOtpRepository,
    private userRepository: IUserRepository,
    private otpHelper: IOtpHelper,
    private tokenService: IToken,
    private otpExpiredInMinutes: number,
    private generateExpiredDate: (timeString: ValidTimeString) => Date
  ) {}

  createAndSendMail = async (data: { email: string; otpType: OtpType }) => {
    try {
      CreateOtpSchema.parse({ email: data.email, type: data.otpType });

      const user = await this.userRepository.findUnique({
        where: { email: data.email },
      });

      this.otpHelper.validateOtpType(data.otpType, user, data.email);

      const { hashedOtp, otp } = await this.otpHelper.generateOtp();

      await this.otpRepository.create({
        data: {
          expiredIn: this.generateExpiredDate(`${this.otpExpiredInMinutes}m`),
          otp: hashedOtp,
          type: data.otpType,
          email: data.email,
        },
      });
      await this.otpHelper.sendOtpMail({
        email: data.email,
        otpType: data.otpType,
        generatedOtp: otp,
        otpExpiredInMinutes: this.otpExpiredInMinutes,
      });
      return "Email has been sent";
    } catch (error) {
      if (error instanceof AuthDomainError) {
        throw error;
      }
      throw new AuthUnexpectedError("OTP_CREATION_FAILED", error);
    }
  };

  async verifyOtp({
    email,
    otp,
    type,
  }: {
    email: string;
    otp: string;
    type: OtpType;
  }) {
    try {
      VerifyOtpSchema.parse({
        email,
        otp,
        type,
      });
      const otpRecord = await this.otpRepository.findFirst({
        where: {
          email,
          type,
        },
        orderBy: { createdAt: "desc" },
      });
      await this.otpHelper.validateOtp(otpRecord, otp);

      const token = this.tokenService.sign({ email, OtpType });

      return token;
    } catch (error) {
      if (error instanceof AuthDomainError) {
        throw error;
      }
      throw new AuthUnexpectedError("OTP_VERIFICATION_FAILED", error);
    }
  }
}
