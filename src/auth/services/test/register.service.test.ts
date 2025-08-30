import { describe, it, expect, beforeEach, vi } from "vitest";
import prisma from "../../../database/__mocks__/prisma.js";
import bcrypt from "bcrypt";
import { createAccessToken } from "../accessToken.service.js";
import { mockUser } from "./test.data.js";
import { register } from "../register.service.js";
import { AuthDomainErrorCodes } from "../../../shared/auth/errors/auth.errors.js";
import { AuthUnexpectedError } from "../../errors/AuthUnexpectedError.js";

// Mock modules
vi.mock("../../../database/prisma.js");
vi.mock("bcrypt");
vi.mock("../refreshToken.service.js");
vi.mock("../accessToken.service.js");

describe("register", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  //1
  it("should successfully register with unique email", async () => {
    // Arrange
    prisma.user.findUnique.mockResolvedValue(null);
    vi.mocked(bcrypt.hash).mockResolvedValue("hashed" as never);

    vi.mocked(createAccessToken).mockReturnValue("access_token");
    prisma.$transaction.mockResolvedValue({
      user: {
        id: mockUser.id,
        email: mockUser.email,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
      },
      refreshToken: "refresh_token",
    });
    // Act
    const result = await register({
      email: mockUser.email,
      password: "password123",
      firstName: mockUser.firstName,
      lastName: mockUser.lastName,
    });

    //Assert
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: "test@example.com" },
    });
    expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);

    expect(createAccessToken).toHaveBeenCalledWith({
      email: "test@example.com",
      id: "1",
    });
    expect(result).toEqual({
      user: {
        id: mockUser.id,
        email: mockUser.email,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
      },
      refreshToken: "refresh_token",
      accessToken: "access_token",
    });
  });

  //2
  it("should throw AuthDomainError if provide used email email", async () => {
    // Arrange
    prisma.user.findUnique.mockResolvedValue(mockUser);

    try {
      // Act
      await register({
        email: mockUser.email,
        password: "password123",
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
      });

      //Assert
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      });
    } catch (err: any) {
      //Assert
      expect(err.code).toBe(AuthDomainErrorCodes.AUTH_USED_EMAIL);
      expect(err.logLevel).toBe("warn");
    }
  });

  //3
  it("should throw AuthUnexpectedError if hashedpassword failed", async () => {
    // Arrange
    prisma.user.findUnique.mockResolvedValue(null);
    vi.mocked(bcrypt.hash).mockRejectedValue(new Error("Database error"));

    expect(
      register({
        email: mockUser.email,
        password: "password123",
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
      })
    ).rejects.throw(AuthUnexpectedError);
  });

  //4
  it("should throw AuthUnexpectedError if create  new user and refreshToken transaction failed", async () => {
    // Arrange
    prisma.user.findUnique.mockResolvedValue(null);
    vi.mocked(bcrypt.hash).mockResolvedValue("hashed" as never);

    prisma.$transaction.mockRejectedValue(new Error("Database error"));
    expect(
      register({
        email: mockUser.email,
        password: "password123",
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
      })
    ).rejects.throw(AuthUnexpectedError);
  });

  //5
  it("should throw AuthUnexpectedError if create  accessToken failed", async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    vi.mocked(bcrypt.hash).mockResolvedValue("hashed" as never);
    prisma.$transaction.mockResolvedValue({
      user: {
        id: mockUser.id,
        email: mockUser.email,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
      },
      refreshToken: "refresh_token",
    });
    vi.mocked(createAccessToken).mockImplementation(() => {
      throw new Error("failed to create access token");
    });
    expect(
      register({
        email: mockUser.email,
        password: "password123",
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
      })
    ).rejects.throw(AuthUnexpectedError);
  });
});
