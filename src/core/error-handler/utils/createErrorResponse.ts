type ErrorInput = {
	code?: unknown
	name?: string
	message?: string
}

export function createErrorResponse<T extends ErrorInput>(error: T) {
	return {
		code: error.code ?? 'UNKNOWN_ERROR',
		message: error.message ?? 'An unknown error occurred.',
		name: error.name ?? 'UnknownError',
	}
}
