import { describe } from "node:test";
import { OtpService } from "./OtpService.js";
import { beforeEach, expect, it, vi } from "vitest";
import {
  mockOtpHelper,
  mockOtpRepository,
  mockUserRepository,
} from "./mocks.js";
import { mockHasher } from "../../core/hasher/mocks.js";
import { mockMailSender } from "../../core/mailer/mocks.js";
import { generateExpiredDate } from "../../core/utils/generate-expired-date.js";
import { AuthDomainError } from "../errors/AuthDomainError.js";
import { AuthDomainErrorCodes } from "../../shared/auth/errors/auth.errors.js";
import { generateRandomNumber } from "../../core/utils/generate-random-integer.js";
import { mockToken } from "../../core/token/mocks.js";

let service: OtpService;
describe("OtpService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    service = new OtpService(
      mockOtpRepository,
      mockUserRepository,
      mockOtpHelper(),
      mockToken,

      10,
      vi.fn()
    );
  });

  it("should throw error for verify email otp if user is exist", async () => {
    mockUserRepository.findUnique.mockResolvedValue({ id: "some-fake-id" });
    await expect(
      service.createAndSendMail({
        email: "khaled@gmail.com",
        otpType: "VERIFY_EMAIL",
      })
    ).rejects.toThrow(AuthDomainError);
    mockUserRepository.findUnique.mockResolvedValue({ id: "some-fake-id" });
    await expect(
      service.createAndSendMail({
        email: "khaled@gmail.com",
        otpType: "VERIFY_EMAIL",
      })
    ).rejects.toMatchObject({
      code: AuthDomainErrorCodes.AUTH_USED_EMAIL,
    });
  });
  it("should throw error for forget password  otp if user is not exist", async () => {
    mockUserRepository.findUnique.mockResolvedValue(null);
    await expect(
      service.createAndSendMail({
        email: "khaled@gmail.com",
        otpType: "FORGET_PASSWORD",
      })
    ).rejects.toMatchObject({
      code: AuthDomainErrorCodes.EMAIL_IS_NOT_EXIST,
    });
  });
  it("should throw error for login  otp if user is not exist", async () => {
    mockUserRepository.findUnique.mockResolvedValue(null);
    await expect(
      service.createAndSendMail({
        email: "khaled@gmail.com",
        otpType: "LOGIN",
      })
    ).rejects.toMatchObject({
      code: AuthDomainErrorCodes.EMAIL_IS_NOT_EXIST,
    });
  });

  it("should throw error for forget password  otp if user is not registered local - does not has password", async () => {
    mockUserRepository.findUnique.mockResolvedValue({ id: "some-fake-id" });
    await expect(
      service.createAndSendMail({
        email: "khaled@gmail.com",
        otpType: "FORGET_PASSWORD",
      })
    ).rejects.toMatchObject({
      code: AuthDomainErrorCodes.USER_NOT_LOCAL,
    });
  });
});
