// __mocks__/repositories.ts
import { vi } from "vitest";
import { IOtpHelper } from "../interfaces/IOtpHelper.js";

export const mockOtpRepository = {
  create: vi.fn(),
  findFirst: vi.fn(),
  update: vi.fn(),
  findMany: vi.fn(),
  delete: vi.fn(),
  findUnique: vi.fn(),
  count: vi.fn(),
  createTransaction: vi.fn(),
};

export const mockRefreshTokenRepository = {
  create: vi.fn(),
  update: vi.fn(),
  findMany: vi.fn(),
  delete: vi.fn(),
  findUnique: vi.fn(),
  count: vi.fn(),
  createTransaction: vi.fn(),
};

export const mockRefreshTokenService = {
  create: vi.fn(),
};

export const mockUserRepository = {
  create: vi.fn(),
  update: vi.fn(),
  findMany: vi.fn(),
  delete: vi.fn(),
  findUnique: vi.fn(),
  count: vi.fn(),
  createTransaction: vi.fn(),
};

export const mockOtpHelper = (): IOtpHelper => ({
  validateOtp: vi.fn().mockResolvedValue(undefined),
  generateOtp: vi.fn().mockResolvedValue({
    otp: 123456,
    hashedOtp: Promise.resolve("hashed-otp"),
  }),
  validateOtpType: vi.fn().mockImplementation(() => undefined),
  sendOtpMail: vi.fn(),
});
