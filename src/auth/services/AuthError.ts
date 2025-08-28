import {
  CustomError,
  CustomErrorType,
} from "../../core/error-handler/index.js";
import { AuthErrorCodesType } from "../../shared/auth/errors/auth.errors.js";

export class AuthError extends CustomError<AuthErrorCodesType> {
  constructor(error: CustomErrorType<AuthErrorCodesType>) {
    super({ ...error, name: "AuthError" });

    Object.setPrototypeOf(this, AuthError.prototype);
  }
}
