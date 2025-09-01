import { IOtpHelper } from "../interfaces/IOtpHelper.js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { OtpHelper } from "./OtpHelper.js";
import { mockHasher } from "../../core/hasher/mocks.js";
import { mockMailSender } from "../../core/mailer/mocks.js";
import { AuthDomainErrorCodes } from "../../shared/auth/errors/auth.errors.js";
import { AuthDomainError } from "../errors/AuthDomainError.js";

let helper: IOtpHelper;

describe("otpHelper", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    helper = new OtpHelper(
      mockHasher,
      mockMailSender,
      { min: 100000, max: 999999 },
      "test-template"
    );
  });

  it("validateOtpType should throw error for login otp if user is not exist", () => {
    expect(() =>
      helper.validateOtpType("LOGIN", null, "khaled@me.com")
    ).toThrow(AuthDomainError);
    expect(() =>
      helper.validateOtpType("LOGIN", null, "khaled@me.com")
    ).toThrow(
      expect.objectContaining({
        code: AuthDomainErrorCodes.EMAIL_IS_NOT_EXIST,
      })
    );
  });

  it("validateOtpType should throw error for forget password  otp if user is not registered local - does not has password", async () => {
    expect(() =>
      helper.validateOtpType(
        "FORGET_PASSWORD",
        { password: null },
        "khaled@gmail.com"
      )
    ).toThrow(
      expect.objectContaining({
        code: AuthDomainErrorCodes.USER_NOT_LOCAL,
      })
    );
  });

  it("validateOtpType should throw error for forget password  otp if user is not exist", async () => {
    expect(() =>
      helper.validateOtpType("FORGET_PASSWORD", null, "email@m.com")
    ).toThrow(
      expect.objectContaining({
        code: AuthDomainErrorCodes.EMAIL_IS_NOT_EXIST,
      })
    );
  });

  it("validateOtpType should throw error for verify email otp if user is exist", async () => {
    expect(() =>
      helper.validateOtpType("VERIFY_EMAIL", {}, "email@m.com")
    ).toThrow(
      expect.objectContaining({
        code: AuthDomainErrorCodes.AUTH_USED_EMAIL,
      })
    );
  });

  // -------------------------------
  // ✅ HAPPY PATHS (no throw)
  // -------------------------------
  it("validateOtpType should pass for VERIFY_EMAIL when user does not exist", () => {
    expect(() =>
      helper.validateOtpType("VERIFY_EMAIL", null, "new@user.com")
    ).not.toThrow();
  });

  it(" validateOtpType should pass for FORGET_PASSWORD when user exists and has password", () => {
    expect(() =>
      helper.validateOtpType(
        "FORGET_PASSWORD",
        { password: "hashed-pass" },
        "existing@user.com"
      )
    ).not.toThrow();
  });

  it("validateOtpType should pass for LOGIN when user exists", () => {
    expect(() =>
      helper.validateOtpType("LOGIN", { password: null }, "existing@user.com")
    ).not.toThrow();
  });

  // -----------------------------
  // validateOtp
  // -----------------------------
  describe("validateOtp", () => {
    it("should pass when otp is valid and not expired", async () => {
      const otpRecord = {
        otp: "hashed-otp",
        expiredIn: new Date(Date.now() + 10000),
      };
      mockHasher.compare.mockResolvedValue(true);

      await expect(
        helper.validateOtp(otpRecord, "123456")
      ).resolves.not.toThrow();

      expect(mockHasher.compare).toHaveBeenCalledWith("123456", "hashed-otp");
    });

    it("should throw OTP_INVALID when otpRecord is null", async () => {
      await expect(helper.validateOtp(null, "123456")).rejects.toThrow(
        AuthDomainError
      );
    });

    it("should throw OTP_INVALID when hasher.compare returns false", async () => {
      const otpRecord = {
        otp: "hashed-otp",
        expiredIn: new Date(Date.now() + 10000),
      };
      mockHasher.compare.mockResolvedValue(false);

      await expect(helper.validateOtp(otpRecord, "123456")).rejects.toThrow(
        AuthDomainError
      );
    });

    it("should throw OTP_EXPIRED when otp is expired", async () => {
      const otpRecord = {
        otp: "hashed-otp",
        expiredIn: new Date(Date.now() - 10000),
      };
      mockHasher.compare.mockResolvedValue(true);

      await expect(helper.validateOtp(otpRecord, "123456")).rejects.toThrow(
        AuthDomainError
      );
    });
  });

  // -----------------------------
  // generateOtp
  // -----------------------------
  describe("generateOtp", () => {
    it("should generate otp and return hashedOtp", async () => {
      mockHasher.hash.mockResolvedValue("hashed-otp");
      const result = await helper.generateOtp();

      expect(result).toHaveProperty("otp");
      expect(result).toHaveProperty("hashedOtp", "hashed-otp");
      expect(mockHasher.hash).toHaveBeenCalledWith(expect.any(String));
      expect(result.otp.length).toBeGreaterThanOrEqual(6);
    });

    it("should throw if min > max in config", () => {
      expect(
        () =>
          new OtpHelper(mockHasher, mockMailSender, {
            min: 999999,
            max: 111111,
          })
      ).toThrowError("Min value cannot be greater than max value");
    });
  });

  // -----------------------------
  // sendOtpMail
  // -----------------------------
  describe("sendOtpMail", () => {
    it("-should call mailer with correct template data", async () => {
      const email = "test@example.com";
      const otpType = "VERIFY_EMAIL";
      const generatedOtp = "123456";

      await helper.sendOtpMail({
        email,
        otpType,
        generatedOtp,
        otpExpiredInMinutes: 10,
      });

      expect(mockMailSender.sendMailWithTemplate).toHaveBeenCalledWith(
        email,
        "VERIFY EMAIL", // underscore replaced with space
        "test-template",
        expect.objectContaining({
          otpType: "VERIFY EMAIL",
          otp: "123456",
          otpExpiredInMinutes: 10,
          year: new Date().getFullYear(),
        })
      );
    });

    it("should allow different otpTemplateName", async () => {
      const customHelper = new OtpHelper(
        mockHasher,
        mockMailSender,
        { min: 100000, max: 999999 },
        "custom-template"
      );
      await customHelper.sendOtpMail({
        email: "me@example.com",
        otpType: "LOGIN",
        generatedOtp: "654321",
        otpExpiredInMinutes: 15,
      });

      expect(mockMailSender.sendMailWithTemplate).toHaveBeenCalledWith(
        "me@example.com",
        "LOGIN",
        "custom-template",
        expect.any(Object)
      );
    });
  });
});
