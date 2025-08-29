// 1

import { beforeEach } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";
import { PrismaClient } from "../../../prisma/generated/prisma/index.js";

// 2
beforeEach(() => {
  mockReset(prisma);
});

// 3
const prisma = mockDeep<PrismaClient>();
export default prisma;
