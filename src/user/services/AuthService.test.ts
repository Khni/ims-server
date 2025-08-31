import { describe, it, expect, beforeEach, vi } from "vitest";

import { AuthService } from "./AuthService.js";
import { mockUser } from "./test.data.js";
import { AuthDomainError } from "../errors/AuthDomainError.js";
import { AuthUnexpectedError } from "../errors/AuthUnexpectedError.js";

// ---- Dependency Mocks ----
const mockUserRepository = {
  findUnique: vi.fn(),
  createTransaction: vi.fn(),
  create: vi.fn(),
};

const mockRefreshTokenService = {
  create: vi.fn(),
};

const mockHasher = {
  hash: vi.fn(),
  compare: vi.fn(),
};

const mockTokenService = {
  sign: vi.fn(),
};

let service: AuthService;

describe("AuthService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    service = new AuthService(
      mockUserRepository as any,
      mockRefreshTokenService as any,
      mockHasher as any,
      mockTokenService as any
    );
  });

  // -------------------------------
  // REGISTER
  // -------------------------------
  describe("register", () => {
    it("should successfully register with unique email", async () => {
      mockUserRepository.findUnique.mockResolvedValue(null);
      mockHasher.hash.mockResolvedValue("hashed_password");
      mockUserRepository.createTransaction.mockImplementation(async (cb) => {
        return cb("tx");
      });
      mockUserRepository.create.mockResolvedValue(mockUser);
      mockRefreshTokenService.create.mockResolvedValue("refresh_token");
      mockTokenService.sign.mockReturnValue("access_token");

      const result = await service.register({
        email: mockUser.email,
        password: "password123",
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
      });

      expect(mockUserRepository.findUnique).toHaveBeenCalledWith({
        where: { email: mockUser.email },
      });
      expect(mockHasher.hash).toHaveBeenCalledWith("password123");
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        data: {
          email: mockUser.email,
          password: "hashed_password",
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
        },
        tx: "tx",
      });
      expect(mockRefreshTokenService.create).toHaveBeenCalledWith(
        mockUser.id,
        "tx"
      );
      expect(mockTokenService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        id: mockUser.id,
      });
      expect(result).toEqual({
        user: { ...mockUser },
        refreshToken: "refresh_token",
        accessToken: "access_token",
      });
    });

    it("should throw AuthDomainError if email already used", async () => {
      mockUserRepository.findUnique.mockResolvedValue(mockUser);

      await expect(
        service.register({
          email: mockUser.email,
          password: "password123",
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
        })
      ).rejects.toThrow(AuthDomainError);
    });

    it("should throw AuthUnexpectedError if hasher.hash fails", async () => {
      mockUserRepository.findUnique.mockResolvedValue(null);
      mockHasher.hash.mockRejectedValue(new Error("hash failed"));

      await expect(
        service.register({
          email: mockUser.email,
          password: "password123",
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
        })
      ).rejects.toBeInstanceOf(AuthUnexpectedError);
    });

    it("should throw AuthUnexpectedError if transaction callback throws", async () => {
      mockUserRepository.findUnique.mockResolvedValue(null);
      mockHasher.hash.mockResolvedValue("hashed_password");
      mockUserRepository.createTransaction.mockRejectedValue(
        new Error("db error")
      );

      await expect(
        service.register({
          email: mockUser.email,
          password: "password123",
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
        })
      ).rejects.toBeInstanceOf(AuthUnexpectedError);
    });

    it("should throw AuthUnexpectedError if tokenService.sign fails", async () => {
      mockUserRepository.findUnique.mockResolvedValue(null);
      mockHasher.hash.mockResolvedValue("hashed_password");
      mockUserRepository.createTransaction.mockImplementation(async (cb) =>
        cb("tx")
      );
      mockUserRepository.create.mockResolvedValue(mockUser);
      mockRefreshTokenService.create.mockResolvedValue("refresh_token");
      mockTokenService.sign.mockImplementation(() => {
        throw new Error("token failed");
      });

      await expect(
        service.register({
          email: mockUser.email,
          password: "password123",
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
        })
      ).rejects.toBeInstanceOf(AuthUnexpectedError);
    });
  });

  // -------------------------------
  // LOGIN
  // -------------------------------
  describe("login", () => {
    it("should successfully login with valid credentials", async () => {
      mockUserRepository.findUnique.mockResolvedValue(mockUser);
      mockHasher.compare.mockResolvedValue(true);
      mockRefreshTokenService.create.mockResolvedValue("refresh_token");
      mockTokenService.sign.mockReturnValue("access_token");

      const result = await service.login({
        email: mockUser.email,
        password: "password123",
      });

      expect(mockUserRepository.findUnique).toHaveBeenCalledWith({
        where: { email: mockUser.email },
      });
      expect(mockHasher.compare).toHaveBeenCalledWith(
        "password123",
        mockUser.password
      );
      expect(mockRefreshTokenService.create).toHaveBeenCalledWith(mockUser.id);
      expect(mockTokenService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        id: mockUser.id,
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

    it("-should throw AuthDomainError for non-existent user", async () => {
      mockUserRepository.findUnique.mockResolvedValue(null);

      await expect(
        service.login({
          email: "nonexistent@example.com",
          password: "12356789",
        })
      ).rejects.toMatchObject({
        code: "INCORRECT_CREDENTIALS",
      });
    });

    it("-should throw AuthDomainError for non-local user", async () => {
      mockUserRepository.findUnique.mockResolvedValue({
        ...mockUser,
        password: null,
      });

      await expect(
        service.login({ email: "oauth@example.com", password: "12356789" })
      ).rejects.toMatchObject({
        code: "USER_NOT_LOCAL",
      });
    });

    it("-should throw AuthDomainError for invalid password", async () => {
      mockUserRepository.findUnique.mockResolvedValue(mockUser);
      mockHasher.compare.mockResolvedValue(false);

      await expect(
        service.login({ email: mockUser.email, password: "wrong-12356789" })
      ).rejects.toMatchObject({
        code: "INCORRECT_CREDENTIALS",
      });
    });

    it("should wrap unexpected errors into AuthUnexpectedError", async () => {
      mockUserRepository.findUnique.mockRejectedValue(
        new Error("database down")
      );

      await expect(
        service.login({ email: mockUser.email, password: "password123" })
      ).rejects.toBeInstanceOf(AuthUnexpectedError);
    });

    it("should throw AuthUnexpectedError if tokenService.sign fails", async () => {
      mockUserRepository.findUnique.mockResolvedValue(mockUser);
      mockHasher.compare.mockResolvedValue(true);
      mockRefreshTokenService.create.mockResolvedValue("refresh_token");
      mockTokenService.sign.mockImplementation(() => {
        throw new Error("sign failed");
      });

      await expect(
        service.login({ email: mockUser.email, password: "password123" })
      ).rejects.toBeInstanceOf(AuthUnexpectedError);
    });

    it("should throw AuthUnexpectedError for invalid schema input", async () => {
      await expect(
        service.login({ email: "", password: "" })
      ).rejects.toBeInstanceOf(AuthUnexpectedError);

      await expect(
        service.login({ email: "", password: "" })
      ).rejects.toMatchObject({
        code: "LOGIN_FAILED",
      });
    });
  });
});
