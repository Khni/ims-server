import prisma from "../../database/prisma.js";
import crypto from "crypto";
import { Prisma } from "../../../generated/prisma/index.js";
export const createRefreshToken = async (
  userId: string,
  tx?: Prisma.TransactionClient
) => {
  const client = tx ?? prisma;
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 15);
  const refreshtoken = await client.refreshToken.create({
    data: {
      token: crypto.randomBytes(40).toString("hex"),
      expiresAt,
      userId,
    },
    select: { token: true },
  });
  return refreshtoken.token;
};
