// __mocks__/utils.ts
import { vi } from "vitest";

export const mockHasher = {
  hash: vi.fn(),
  compare: vi.fn(),
};
