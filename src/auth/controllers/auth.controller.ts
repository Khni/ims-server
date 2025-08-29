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
import { register } from "../services/register.service.js";
import { RefreshTokenCookie } from "../helpers/refreshToken.cookie.js";
import { config } from "../../config/envSchema.js";
import { login } from "../services/login.service.js";
import type {
  LocalLoginInput,
  LocalRegisterInput,
} from "../../shared/auth/types/index.js";
import { validateBodySchema } from "../../core/utils/schema/validateBodySchemaMiddleware.js";
import {
  loginBodySchema,
  registerBodySchema,
} from "../../shared/auth/schemas/index.js";

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
      const { accessToken, refreshToken, user } = await register({ ...body });

      this.refreshTokenCookie.setToken(refreshToken, req.res!);

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
      const { refreshToken, ...result } = await login(body);

      this.refreshTokenCookie.setToken(refreshToken, req.res!);

      return result;
    } catch (error) {
      if (error instanceof AuthError) {
        throw errorMapper(error, authErrorMapping);
      }
      throw error;
    }
  }
}
