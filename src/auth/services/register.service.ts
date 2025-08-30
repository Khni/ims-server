import prisma from "../../database/prisma.js";
import { AuthError } from "../errors/AuthError.js";
import bcrypt from "bcrypt";
import { createRefreshToken } from "./refreshToken.service.js";
import jwt from "jsonwebtoken";
import { config } from "../../config/envSchema.js";
import { createAccessToken } from "./accessToken.service.js";
import { Prisma } from "../../../prisma/generated/prisma/index.js";
import { AuthDomainError } from "../errors/AuthDomainError.js";
import { AuthUnexpectedError } from "../errors/AuthUnexpectedError.js";
import { registerBodySchema } from "../../shared/auth/schemas/index.js";
export const register = async (data: Prisma.UserCreateInput) => {
  try {
    //parse data is critical/unexpected error because it means it passed the frontend and controller validation!
    const { email, password, firstName, lastName } =
      registerBodySchema.parse(data);

    const isUsedIdentifier = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (isUsedIdentifier) {
      throw new AuthDomainError("AUTH_USED_EMAIL");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const { refreshToken, user } = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { email, firstName, lastName, password: hashedPassword },
        select: { id: true, email: true, firstName: true, lastName: true },
      });
      const refreshToken = await createRefreshToken(user.id, tx);

      return { user, refreshToken: refreshToken };
    });
    const accessToken = createAccessToken({ email: user.email, id: user.id });
    return {
      user: { ...user },
      refreshToken,
      accessToken,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    throw new AuthUnexpectedError("AUTH_USER_CREATION_FAILED", error);
  }
};
