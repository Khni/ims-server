// utils/RefreshTokenManager.ts
import { Response } from "express";

export interface RefreshTokenOptions {
  cookieName?: string;
  path?: string;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
  maxAge?: number; // in seconds
  domain?: string;
}

export class RefreshTokenCookie {
  private options: Omit<Required<RefreshTokenOptions>, "domain"> & {
    domain?: string;
  };

  constructor(
    private isProduction: boolean,
    options: RefreshTokenOptions = {}
  ) {
    this.options = {
      cookieName: options.cookieName ?? "refreshToken",
      path: options.path ?? "/",
      httpOnly: options.httpOnly ?? true,
      secure: options.secure ?? this.isProduction,
      sameSite: options.sameSite ?? (this.isProduction ? "lax" : "strict"),
      maxAge: options.maxAge ?? 60 * 60 * 24 * 15, // 15 days
      domain: options.domain,
    };
  }

  /**
   * Create/Set a refresh token cookie
   */
  public setToken(token: string, res: Response): void {
    if (!token) throw new Error("Refresh token is required");

    res.cookie(this.options.cookieName, token, {
      httpOnly: this.options.httpOnly,
      path: this.options.path,
      secure: this.options.secure,
      sameSite: this.options.sameSite,
      maxAge: this.options.maxAge * 1000, // express expects ms
      domain: this.options.domain,
    });
  }

  /**
   * Clear the refresh token cookie
   */
  public clearToken(res: Response): void {
    if (!res) throw new Error("Express response object is required");
    console.log(this.options.cookieName, "this.options.cookieName");
    res.clearCookie(this.options.cookieName, {
      httpOnly: this.options.httpOnly,
      path: this.options.path,
      secure: this.options.secure,
      sameSite: this.options.sameSite,
      domain: this.options.domain,
    });
  }
}
