import prisma from "../../database/prisma.js";
import bcrypt from "bcrypt";

import { createRefreshToken } from "./refreshToken.service.js";
import { createAccessToken } from "./accessToken.service.js";
import { loginBodySchema } from "../../shared/auth/schemas/index.js";

import { AuthError } from "../errors/AuthError.js";
import { AuthDomainError } from "../errors/AuthDomainError.js";
import { AuthUnexpectedError } from "../errors/AuthUnexpectedError.js";

export const login = async (data: { email: string; password: string }) => {
  try {
    //parse email and password is critical error because it means it passed the frontend and controller validation!
    const { email, password } = loginBodySchema.parse(data);

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new AuthDomainError(
        "INCORRECT_CREDENTIALS",
        `Email ${email} is not exist`
      );
    }

    if (!user.password) {
      throw new AuthDomainError(
        "USER_NOT_LOCAL",
        `Email ${email} is not local registered`
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new AuthDomainError(
        "INCORRECT_CREDENTIALS",
        `password for Email ${email} is not Match`
      );
    }
    const refreshToken = await createRefreshToken(user.id);
    const accessToken = createAccessToken({ email: user.email, id: user.id });
    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      refreshToken,
      accessToken,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }

    throw new AuthUnexpectedError("LOGIN_FAILED", error);
  }
};
