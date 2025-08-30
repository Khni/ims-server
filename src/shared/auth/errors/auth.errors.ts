// Domain Errors (expected, user-facing)
export const AuthDomainErrorCodes = {
  AUTH_USED_EMAIL: "AUTH_USED_EMAIL",
  AUTH_UNVERIFIED_EMAIL: "AUTH_UNVERIFIED_EMAIL",
  INCORRECT_CREDENTIALS: "INCORRECT_CREDENTIALS",
  USER_NOT_LOCAL: "USER_NOT_LOCAL",
  REFRESH_TOKEN_INVALID: "REFRESH_TOKEN_INVALID",
  MISSING_OR_MALFORMED_AUTHORIZATION_HEADER:
    "MISSING_OR_MALFORMED_AUTHORIZATION_HEADER",
  INVALID_ACCESS_TOKEN: "INVALID_ACCESS_TOKEN",
  MISSING_REFRESH_TOKEN: "MISSING_REFRESH_TOKEN",
} as const;

// Unexpected/Internal Errors
export const AuthUnexpectedErrorCodes = {
  AUTH_USER_CREATION_FAILED: "AUTH_USER_CREATION_FAILED",
  ISSUE_TOKEN_FAILED: "ISSUE_TOKEN_FAILED",
  PASSWORD_RESET_FAILED: "PASSWORD_RESET_FAILED",
  REFRESHTOKEN_REVOKE_FAILED: "REFRESHTOKEN_REVOKE_FAILED",
  LOGIN_FAILED: "LOGIN_FAILED",
} as const;
export type AuthDomainErrorCodesType =
  (typeof AuthDomainErrorCodes)[keyof typeof AuthDomainErrorCodes];

export type AuthUnexpectedErrorCodesType =
  (typeof AuthUnexpectedErrorCodes)[keyof typeof AuthUnexpectedErrorCodes];

// Combined
export const AuthErrorCodes = {
  ...AuthDomainErrorCodes,
  ...AuthUnexpectedErrorCodes,
} as const;

export type AuthErrorCodesType =
  (typeof AuthErrorCodes)[keyof typeof AuthErrorCodes];

// --- Domain Mapping ---
export const authDomainErrorMapping = {
  [AuthDomainErrorCodes.AUTH_USED_EMAIL]: {
    statusCode: 409, // Conflict
    responseMessage: "Email already registered",
  },
  [AuthDomainErrorCodes.AUTH_UNVERIFIED_EMAIL]: {
    statusCode: 403, // Forbidden
    responseMessage: "Email verification required",
  },
  [AuthDomainErrorCodes.INCORRECT_CREDENTIALS]: {
    statusCode: 401, // Unauthorized
    responseMessage: "Invalid credentials",
  },
  [AuthDomainErrorCodes.USER_NOT_LOCAL]: {
    statusCode: 400, // Bad Request
    responseMessage: "External authentication required",
  },
  [AuthDomainErrorCodes.REFRESH_TOKEN_INVALID]: {
    statusCode: 401,
    responseMessage:
      "Refresh token is invalid or expired. Please log in again.",
  },
  [AuthDomainErrorCodes.MISSING_OR_MALFORMED_AUTHORIZATION_HEADER]: {
    statusCode: 401, // Unauthorized
    responseMessage: "Access is denied.",
  },
  [AuthDomainErrorCodes.INVALID_ACCESS_TOKEN]: {
    statusCode: 401, // Unauthorized
    responseMessage:
      "The provided access token is invalid or has expired. Please log in again.",
  },
  [AuthDomainErrorCodes.MISSING_REFRESH_TOKEN]: {
    statusCode: 400,
    responseMessage: "You are already Logged out",
  },
} as const;

// --- Unexpected Mapping ---
export const authUnexpectedErrorMapping = {
  [AuthUnexpectedErrorCodes.AUTH_USER_CREATION_FAILED]: {
    statusCode: 500, // Internal Server Error
    responseMessage: "Account creation failed",
  },
  [AuthUnexpectedErrorCodes.ISSUE_TOKEN_FAILED]: {
    statusCode: 400,
    responseMessage: "Unexpected error while issuing tokens.",
  },
  [AuthUnexpectedErrorCodes.PASSWORD_RESET_FAILED]: {
    statusCode: 500, // Internal Server Error
    responseMessage: "Password Reset Failed",
  },
  [AuthUnexpectedErrorCodes.REFRESHTOKEN_REVOKE_FAILED]: {
    statusCode: 500, // Internal Server Error
    responseMessage: "Failed to Logout",
  },
  [AuthUnexpectedErrorCodes.LOGIN_FAILED]: {
    statusCode: 500,
    responseMessage: "something went wrong while login",
  },
} as const;

// --- Combined Mapping ---
export const authErrorMapping = {
  ...authDomainErrorMapping,
  ...authUnexpectedErrorMapping,
} as const satisfies Record<
  AuthErrorCodesType,
  {
    statusCode: number;
    responseMessage: string;
  }
>;
