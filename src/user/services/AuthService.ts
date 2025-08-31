import { IHasher } from "../../core/hasher/IHasher.js";
import { IToken } from "../../core/token/IToken.js";
import {
  loginBodySchema,
  registerBodySchema,
} from "../../shared/auth/schemas/index.js";
import { LocalRegisterInput } from "../../shared/auth/types/index.js";
import { AuthDomainError } from "../errors/AuthDomainError.js";

import { AuthUnexpectedError } from "../errors/AuthUnexpectedError.js";
import { IRefreshTokenService } from "../interfaces/IRefreshTokenService.js";
import { IUserRepository } from "../interfaces/IUserRepository.js";

export class AuthService {
  constructor(
    private userRepository: IUserRepository,
    private refreshTokenService: IRefreshTokenService,
    private hasher: IHasher,
    private tokenService: IToken
  ) {}

  register = async (data: LocalRegisterInput) => {
    try {
      //parse data is critical/unexpected error because it means it passed the frontend and controller validation!
      const { email, password, firstName, lastName } =
        registerBodySchema.parse(data);

      const isUsedIdentifier = await this.userRepository.findUnique({
        where: { email },
      });

      if (isUsedIdentifier) {
        throw new AuthDomainError("AUTH_USED_EMAIL");
      }
      const hashedPassword = await this.hasher.hash(password);
      const { refreshToken, user } =
        await this.userRepository.createTransaction(async (tx) => {
          const user = await this.userRepository.create({
            data: {
              email,
              password: hashedPassword,
              firstName,
              lastName,
            },
            tx,
          });
          const refreshToken = await this.refreshTokenService.create(
            user.id,
            tx
          );

          return { user, refreshToken: refreshToken };
        });

      const accessToken = this.tokenService.sign({
        email: user.email,
        id: user.id,
      });
      return {
        user: { ...user },
        refreshToken,
        accessToken,
      };
    } catch (error) {
      if (error instanceof AuthDomainError) {
        throw error;
      }
      throw new AuthUnexpectedError("AUTH_USER_CREATION_FAILED", error);
    }
  };

  login = async (data: { email: string; password: string }) => {
    try {
      //parse email and password is critical error because it means it passed the frontend and controller validation!
      const { email, password } = loginBodySchema.parse(data);

      const user = await this.userRepository.findUnique({ where: { email } });
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

      const isValidPassword = await this.hasher.compare(
        password,
        user.password
      );
      if (!isValidPassword) {
        throw new AuthDomainError(
          "INCORRECT_CREDENTIALS",
          `password for Email ${email} is not Match`
        );
      }
      const refreshToken = await this.refreshTokenService.create(user.id);
      const accessToken = this.tokenService.sign({
        email: user.email,
        id: user.id,
      });
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
      if (error instanceof AuthDomainError) {
        throw error;
      }

      throw new AuthUnexpectedError("LOGIN_FAILED", error);
    }
  };
}
