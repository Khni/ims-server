type ErrorInput = {
  code?: unknown;
  name?: string;
  responseMessage?: string;
};

export function createErrorResponse<T extends ErrorInput>(error: T) {
  return {
    code: error.code ?? "UNKNOWN_ERROR",
    message: error.responseMessage ?? "An unknown error occurred.",
    name: error.name ?? "UnknownError",
  };
}
