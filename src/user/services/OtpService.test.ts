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
import { AuthUnexpectedError } from "../errors/AuthUnexpectedError.js";

let service: OtpService;
describe("OtpService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    service = new OtpService(
      mockOtpRepository,
      mockUserRepository,
      mockOtpHelper,
      mockToken,

      10,
      generateExpiredDate
    );
  });

  // -------------------------------
  // ✅ HAPPY PATH
  // -------------------------------
  it("should create otp and send mail successfully when validation passes", async () => {
    mockUserRepository.findUnique.mockResolvedValue(null); // no user (ok for VERIFY_EMAIL)
    mockOtpHelper.validateOtpType.mockImplementation(() => {}); // pass validation
    mockOtpHelper.generateOtp.mockResolvedValue({
      hashedOtp: "hashed123",
      otp: "123456",
    });
    mockOtpRepository.create.mockResolvedValue({}); // simulate DB insert
    mockOtpHelper.sendOtpMail.mockResolvedValue(undefined);

    await expect(
      service.createAndSendMail({
        email: "khaled@me.com",
        otpType: "VERIFY_EMAIL",
      })
    ).resolves.toBe("Email has been sent");

    expect(mockUserRepository.findUnique).toHaveBeenCalledWith({
      where: { email: "khaled@me.com" },
    });
    expect(mockOtpRepository.create).toHaveBeenCalled();
    expect(mockOtpHelper.sendOtpMail).toHaveBeenCalled();
  });

  // -------------------------------
  // ❌ ERROR PATHS
  // -------------------------------

  it("should throw AuthDomainError if validateOtpType throws", async () => {
    mockUserRepository.findUnique.mockResolvedValue({ id: "some-id" });
    mockOtpHelper.validateOtpType.mockImplementation(() => {
      throw new AuthDomainError(
        AuthDomainErrorCodes.AUTH_USED_EMAIL,
        "email used"
      );
    });

    await expect(
      service.createAndSendMail({
        email: "khaled@me.com",
        otpType: "VERIFY_EMAIL",
      })
    ).rejects.toBeInstanceOf(AuthDomainError);
    await expect(
      service.createAndSendMail({
        email: "khaled@gmail.com",
        otpType: "VERIFY_EMAIL",
      })
    ).rejects.toMatchObject({
      code: AuthDomainErrorCodes.AUTH_USED_EMAIL,
    });
  });

  it("should throw AuthUnexpectedError if an unexpected error occurs", async () => {
    mockUserRepository.findUnique.mockRejectedValue(new Error("DB down"));

    await expect(
      service.createAndSendMail({
        email: "khaled@me.com",
        otpType: "VERIFY_EMAIL",
      })
    ).rejects.toBeInstanceOf(AuthUnexpectedError);
  });

  /**
   * VerifyOTP
   */

  it("verifyOtp should return token when OTP is valid", async () => {
    const fakeOtpRecord = { id: "otp-id", otp: "hashed-otp" };

    mockOtpRepository.findFirst.mockResolvedValue(fakeOtpRecord);
    mockOtpHelper.validateOtp.mockImplementation(() => {}); // pass validation
    mockToken.sign.mockReturnValue("signed-jwt-token");

    await expect(
      service.verifyOtp({
        email: "khaled@me.com",
        otp: "123456",
        type: "LOGIN",
      })
    ).resolves.toBe("signed-jwt-token");

    expect(mockOtpRepository.findFirst).toHaveBeenCalledWith({
      where: { email: "khaled@me.com", type: "LOGIN" },
      orderBy: { createdAt: "desc" },
    });
    expect(mockOtpHelper.validateOtp).toHaveBeenCalledWith(
      fakeOtpRecord,
      "123456"
    );
    expect(mockToken.sign).toHaveBeenCalledWith({
      email: "khaled@me.com",
      OtpType: expect.anything(), // adjust to match your real payload
    });
  });

  it("verifyOtp should throw AuthDomainError if validateOtp throws a domain error", async () => {
    mockOtpRepository.findFirst.mockResolvedValue({ otp: "hashed-otp" });
    mockOtpHelper.validateOtp.mockRejectedValue(
      new AuthDomainError("OTP_INVALID", "OTP is invalid")
    );

    await expect(
      service.verifyOtp({
        email: "khaled@me.com",
        otp: "wrong-1",
        type: "LOGIN",
      })
    ).rejects.toBeInstanceOf(AuthDomainError);
  });

  it("verifyOtp should throw AuthUnexpectedError if repository fails", async () => {
    mockOtpRepository.findFirst.mockRejectedValue(
      new Error("DB connection failed")
    );

    await expect(
      service.verifyOtp({
        email: "khaled@me.com",
        otp: "123456",
        type: "LOGIN",
      })
    ).rejects.toBeInstanceOf(AuthUnexpectedError);
  });

  it("verifyOtp should throw AuthUnexpectedError if token signing fails", async () => {
    mockOtpRepository.findFirst.mockResolvedValue({ otp: "hashed-otp" });
    mockOtpHelper.validateOtp.mockImplementation(() => {});
    mockToken.sign.mockImplementation(() => {
      throw new Error("Token signing failed");
    });

    await expect(
      service.verifyOtp({
        email: "khaled@me.com",
        otp: "123456",
        type: "LOGIN",
      })
    ).rejects.toBeInstanceOf(AuthUnexpectedError);
  });
});
