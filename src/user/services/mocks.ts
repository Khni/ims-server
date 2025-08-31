// __mocks__/repositories.ts
import { vi } from "vitest";

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
