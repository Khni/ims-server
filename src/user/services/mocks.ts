// __mocks__/repositories.ts
import { vi } from "vitest";
import { IOtpHelper } from "../interfaces/IOtpHelper.js";
import { IUserRepository } from "../interfaces/IUserRepository.js";

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

export const mockOtpHelper = {
  validateOtp: vi.fn(),
  generateOtp: vi.fn().mockResolvedValue({
    otp: 123456,
    hashedOtp: "hadhed-otp",
  }),
  validateOtpType: vi.fn(),
  sendOtpMail: vi.fn(),
};
