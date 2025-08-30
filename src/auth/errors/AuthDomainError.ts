import { AuthDomainErrorCodesType } from "../../shared/auth/errors/auth.errors.js";
import { AuthError } from "./AuthError.js";

export class AuthDomainError extends AuthError {
  constructor(code: AuthDomainErrorCodesType, msg?: string, meta?: {}) {
    super({
      code,
      name: "AuthDomainError",
      logLevel: "warn",
      message: msg || code,
      meta,
    });

    Object.setPrototypeOf(this, AuthDomainError.prototype);
  }
}
