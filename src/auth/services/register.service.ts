import prisma from "../../database/prisma.js";
import { AuthError } from "../errors/AuthError.js";
import bcrypt from "bcrypt";
import { createRefreshToken } from "./refreshToken.service.js";
import jwt from "jsonwebtoken";
import { config } from "../../config/envSchema.js";
import { createAccessToken } from "./accessToken.service.js";
import { Prisma } from "../../../prisma/generated/prisma/index.js";
export const register = async ({
  email,
  password,
  firstName,
  lastName,
}: Prisma.UserCreateInput) => {
  try {
    if (!email || !password || !firstName || !lastName) {
      throw new Error("Missing email,password,firstname,lastname in register");
    }
    const isUsedIdentifier = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (isUsedIdentifier) {
      throw new AuthError({
        code: "AUTH_USED_EMAIL",
        logLevel: "warn",
        message: `Email is used ${email}`,
      });
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
    throw new AuthError({
      code: "AUTH_USER_CREATION_FAILED",
      logLevel: "error",
      cause: error,
      message: "Error register user",
    });
  }
};
