import { CustomError } from '../custom-errors/CustomError.js'
import { HttpError } from '../http-errors/HttpError.js'
import { MappedHttpError } from './MappedHttpError.js'

// Generic error mapper function
export function errorMapper<CodeType extends string | number | symbol>(
	error: CustomError<CodeType>,
	codeMapping: Record<CodeType, { statusCode: number; responseMessage: string }>,
): HttpError {
	const mapping = codeMapping[error.code]

	if (!mapping) {
		// Fallback for unmapped codes
		return new MappedHttpError({
			statusCode: 500,
			responseMessage: 'Internal Server Error',
			name: error.name,
			message: error.message,
			code: error.code,
			logLevel: error.logLevel,
			meta: error.meta,
			cause: error.cause,
		})
	}

	return new MappedHttpError({
		statusCode: mapping.statusCode,
		responseMessage: mapping.responseMessage,
		name: error.name,
		message: error.message,
		code: error.code,
		logLevel: error.logLevel,
		meta: error.meta,
		cause: error.cause,
	})
}
