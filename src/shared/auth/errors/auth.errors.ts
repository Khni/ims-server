export const AuthErrorCodes = {
  AUTH_USED_EMAIL: "AUTH_USED_EMAIL",
  AUTH_UNVERIFIED_EMAIL: "AUTH_UNVERIFIED_EMAIL",
  AUTH_USER_CREATION_FAILED: "AUTH_USER_CREATION_FAILED",
  INCORRECT_CREDENTIALS: "INCORRECT_CREDENTIALS",
  USER_NOT_LOCAL: "USER_NOT_LOCAL",
  REFRESH_TOKEN_INVALID: "REFRESH_TOKEN_INVALID",
  ISSUE_TOKEN_FAILED: "ISSUE_TOKEN_FAILED",
  MISSING_OR_MALFORMED_AUTHORIZATION_HEADER:
    "MISSING_OR_MALFORMED_AUTHORIZATION_HEADER",
  INVALID_ACCESS_TOKEN: "INVALID_ACCESS_TOKEN",
  PASSWORD_RESET_FAILED: "PASSWORD_RESET_FAILED",
  REFRESHTOKEN_REVOKE_FAILED: "REFRESHTOKEN_REVOKE_FAILED",
  MISSING_REFRESH_TOKEN: "MISSING_REFRESH_TOKEN",
  LOGIN_FAILED: "LOGIN_FAILED",
} as const;

export type AuthErrorCodesType =
  (typeof AuthErrorCodes)[keyof typeof AuthErrorCodes];
export const authErrorMapping = {
  [AuthErrorCodes.AUTH_USED_EMAIL]: {
    statusCode: 409, // Conflict
    responseMessage: "Email already registered",
  },
  [AuthErrorCodes.AUTH_UNVERIFIED_EMAIL]: {
    statusCode: 403, // Forbidden
    responseMessage: "Email verification required",
  },
  [AuthErrorCodes.AUTH_USER_CREATION_FAILED]: {
    statusCode: 500, // Internal Server Error
    responseMessage: "Account creation failed",
  },
  [AuthErrorCodes.INCORRECT_CREDENTIALS]: {
    statusCode: 401, // Unauthorized
    responseMessage: "Invalid credentials",
  },
  [AuthErrorCodes.USER_NOT_LOCAL]: {
    statusCode: 400, // Bad Request
    responseMessage: "External authentication required",
  },
  [AuthErrorCodes.REFRESH_TOKEN_INVALID]: {
    statusCode: 401,
    responseMessage:
      "Refresh token is invalid or expired. Please log in again.",
  },
  [AuthErrorCodes.ISSUE_TOKEN_FAILED]: {
    statusCode: 400,
    responseMessage: "Unexpected error while issuing tokens.",
  },
  [AuthErrorCodes.MISSING_OR_MALFORMED_AUTHORIZATION_HEADER]: {
    statusCode: 401, // Unauthorized
    responseMessage: "Access is denied.",
  },
  [AuthErrorCodes.INVALID_ACCESS_TOKEN]: {
    statusCode: 401, // Unauthorized
    responseMessage:
      "The provided access token is invalid or has expired. Please log in again.",
  },
  [AuthErrorCodes.PASSWORD_RESET_FAILED]: {
    statusCode: 500, // Internal Server Error
    responseMessage: "Password Reset Failed",
  },
  [AuthErrorCodes.REFRESHTOKEN_REVOKE_FAILED]: {
    statusCode: 500, // Internal Server Error
    responseMessage: "Failed to Logout",
  },
  [AuthErrorCodes.MISSING_REFRESH_TOKEN]: {
    statusCode: 400,
    responseMessage: "You are already Logged out",
  },
  [AuthErrorCodes.LOGIN_FAILED]: {
    statusCode: 500,
    responseMessage: "something went wrong while login",
  },
} as const satisfies Record<
  AuthErrorCodesType,
  {
    statusCode: number;
    responseMessage: string;
  }
>;
