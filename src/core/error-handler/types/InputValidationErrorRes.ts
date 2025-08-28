/**
 * Represents a standardized error response format.
 */
export type InputValidationError = {
  /**
   * A string identifier for the type of error.
   * Examples: "ValidationError", "IncorrectOtpError", "AuthError"
   */
  name: string;

  /**
   * An array of error details. Each entry may represent a field-specific or general error.
   */
  errors: {
    /**
     * (Optional) The name of the field that caused the error.
     * Omitted if the error is general (not tied to a specific field).
     *
     * Example: "email", "password"
     */
    field?: string;

    /**
     * One or more messages describing the error(s).
     *
     * Example: ["Email is required", "Email must be valid"]
     */
    messages: string[];
  }[];
};
