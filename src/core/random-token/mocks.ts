import { vi } from "vitest";

export const mockRandomTokenGenerator = {
  generateHexToken: vi.fn(),
  generateBase64UrlToken: vi.fn(),
  generateUUID: vi.fn(),
};
