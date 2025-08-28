import { InputValidationError } from '../../types/InputValidationErrorRes.js'

/**
 * Creates a structured error response.
 * @param name - The error name or context.
 * @param responseMessage - A single message or array of messages describing the error.
 * @returns A formatted error response object.
 */
export function createInputValidationErrorRes(
	name: string,
	responseMessage: string | string[],
): InputValidationError {
	const messages = Array.isArray(responseMessage) ? responseMessage : [responseMessage]

	return {
		name,
		errors: [{ messages }],
	}
}
