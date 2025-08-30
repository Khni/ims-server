import { describe, it, expect, beforeEach, vi } from "vitest";

import prisma from "../../database/__mocks__/prisma.js";
import bcrypt from "bcrypt";

import { createRefreshToken } from "./refreshToken.service.js";
import { createAccessToken } from "./accessToken.service.js";
import { OauthProvider, User } from "../../../prisma/generated/prisma/index.js";
import { login } from "./login.service.js";
import { ZodError } from "zod";
import { AuthError } from "../errors/AuthError.js";
import { AuthDomainError } from "../errors/AuthDomainError.js";

// Mock modules
vi.mock("../../database/prisma.js");
vi.mock("bcrypt");
vi.mock("./refreshToken.service.js");
vi.mock("./accessToken.service.js");

const mockUser: User = {
  id: "1",
  isActive: true,
  createdAt: new Date("2024-01-01T12:00:00.000Z"),
  updatedAt: new Date("2024-06-01T12:00:00.000Z"),
  email: "test@example.com",
  firstName: "John",
  lastName: "Doe",
  password: "hashed_password", // hashed password stub
  picture: "https://example.com/avatar.png",
  oauthProvider: OauthProvider.NONE,
  oauthId: null,
};

describe("login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should successfully login with valid credentials", async () => {
    // Arrange
    prisma.user.findUnique.mockResolvedValue(mockUser);
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
    vi.mocked(createRefreshToken).mockResolvedValue("refresh_token");
    vi.mocked(createAccessToken).mockReturnValue("access_token");

    // Act
    const result = await login({
      email: "test@example.com",
      password: "password123",
    });

    // Assert
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: "test@example.com" },
    });
    expect(bcrypt.compare).toHaveBeenCalledWith(
      "password123",
      "hashed_password"
    );
    expect(createRefreshToken).toHaveBeenCalledWith("1");
    expect(createAccessToken).toHaveBeenCalledWith({
      email: "test@example.com",
      id: "1",
    });
    expect(result).toEqual({
      user: {
        id: "1",
        email: "test@example.com",
        firstName: "John",
        lastName: "Doe",
      },
      refreshToken: "refresh_token",
      accessToken: "access_token",
    });
  });

  it("should throw error for missing credentials", async () => {
    try {
      await login({ email: "", password: "" });
    } catch (err: any) {
      expect(err.code).toBe("LOGIN_FAILED");
      expect(err.logLevel).toBe("error");

      expect(err.cause).toBeInstanceOf(ZodError);
    }
  });

  it("should throw AuthDomainError for non-existent user", async () => {
    // Arrange
    prisma.user.findUnique.mockResolvedValue(null);

    // Act & Assert
    await expect(
      login({
        email: "nonexistent@example.com",
        password: "password123",
      })
    ).rejects.toThrow(AuthDomainError);

    await expect(
      login({
        email: "nonexistent@example.com",
        password: "password123",
      })
    ).rejects.toMatchObject({
      code: "INCORRECT_CREDENTIALS",
      message: "Email nonexistent@example.com is not exist",
    });
  });

  it("should throw AuthDomainError for non-local user", async () => {
    // Arrange
    prisma.user.findUnique.mockResolvedValue({
      ...mockUser,
      password: null,
    });

    // Act & Assert
    await expect(
      login({
        email: "oauth@example.com",
        password: "password123",
      })
    ).rejects.toThrow(AuthDomainError);

    await expect(
      login({
        email: "oauth@example.com",
        password: "password123",
      })
    ).rejects.toMatchObject({
      code: "USER_NOT_LOCAL",
      message: "Email oauth@example.com is not local registered",
    });
  });

  it("should throw AuthDomainError for invalid password", async () => {
    // Arrange
    prisma.user.findUnique.mockResolvedValue(mockUser);
    vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

    // Act & Assert
    await expect(
      login({
        email: "test@example.com",
        password: "wrongpassword",
      })
    ).rejects.toThrow(AuthDomainError);

    await expect(
      login({
        email: "test@example.com",
        password: "wrongpassword",
      })
    ).rejects.toMatchObject({
      code: "INCORRECT_CREDENTIALS",
      message: "password for Email test@example.com is not Match",
    });
  });

  it("should handle unexpected errors", async () => {
    // Arrange
    prisma.user.findUnique.mockRejectedValue(new Error("Database error"));

    // Act & Assert
    await expect(
      login({
        email: "test@example.com",
        password: "password123",
      })
    ).rejects.toMatchObject({
      code: "LOGIN_FAILED",
      logLevel: "error",
    });

    await expect(
      login({
        email: "test@example.com",
        password: "password123",
      })
    ).rejects.toMatchObject({
      code: "LOGIN_FAILED",
    });
  });
});

////
