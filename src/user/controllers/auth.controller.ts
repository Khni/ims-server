import {
  Body,
  Controller,
  Middlewares,
  Post,
  Route,
  SuccessResponse,
  Tags,
  Request,
} from "tsoa";
import type { Request as ExpressRequestType } from "express";
import { errorMapper } from "../../core/error-handler/index.js";
import { authErrorMapping } from "../../shared/auth/errors/auth.errors.js";
import { AuthError } from "../errors/AuthError.js";

import { RefreshTokenCookie } from "../helpers/refreshToken.cookie.js";
import { config } from "../../config/envSchema.js";

import type {
  LocalLoginInput,
  LocalRegisterInput,
} from "../../shared/auth/types/index.js";
import { validateBodySchema } from "../../core/utils/schema/validateBodySchemaMiddleware.js";
import {
  loginBodySchema,
  registerBodySchema,
} from "../../shared/auth/schemas/index.js";
import { authService } from "../authFactory.js";

@Tags("Authentication")
@Route("auth")
export class AuthController extends Controller {
  private refreshTokenCookie: RefreshTokenCookie;

  constructor() {
    super();
    const env = config();
    this.refreshTokenCookie = new RefreshTokenCookie(
      env.NODE_ENV === "production"
    );
  }
  @Middlewares([validateBodySchema(registerBodySchema)])
  @Post("register")
  @SuccessResponse("201", "Created")
  public async register(
    @Body()
    body: LocalRegisterInput,
    @Request() req: ExpressRequestType
  ): Promise<{
    accessToken: string;

    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
    };
  }> {
    try {
      const { accessToken, refreshToken, user } = await authService.register({
        ...body,
      });

      this.refreshTokenCookie.setToken(refreshToken.token, req.res!);

      return { accessToken, user };
    } catch (error) {
      if (error instanceof AuthError) {
        throw errorMapper(error, authErrorMapping);
      }
      throw error;
    }
  }
  @Middlewares([validateBodySchema(loginBodySchema)])
  @Post("login")
  public async login(
    @Body()
    body: LocalLoginInput,
    @Request() req: ExpressRequestType
  ): Promise<
    Promise<{
      accessToken: string;

      user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
      };
    }>
  > {
    try {
      const { refreshToken, ...result } = await authService.login(body);

      this.refreshTokenCookie.setToken(refreshToken.token, req.res!);

      return result;
    } catch (error) {
      if (error instanceof AuthError) {
        throw errorMapper(error, authErrorMapping);
      }
      throw error;
    }
  }
}
