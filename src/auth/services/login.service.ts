import prisma from "../../database/prisma.js";
import bcrypt from "bcrypt";
import { AuthError } from "./AuthError.js";
import { createRefreshToken } from "./refreshToken.service.js";
import { createAccessToken } from "./accessToken.service.js";

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    if (!email || !password) {
      throw new Error("Missing email,password in login");
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new AuthError({
        code: "INCORRECT_CREDENTIALS",
        message: `Email ${email} is not exist`,
        logLevel: "warn",
      });
    }

    if (!user.password) {
      throw new AuthError({
        code: "USER_NOT_LOCAL",
        message: `Email ${email} is not local registered`,
        logLevel: "warn",
      });
    }

    const isValidPassword = bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new AuthError({
        code: "INCORRECT_CREDENTIALS",
        message: `password for Email ${email} is not Match`,
        logLevel: "warn",
      });
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
    throw new AuthError({
      code: "LOGIN_FAILED",
      cause: error,
      message: "something went wrong while Login",
      logLevel: "error",
    });
  }
};
