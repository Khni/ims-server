import { HttpError } from '../http-errors/HttpError.js'
import { LogLevel } from '../types/LogLevelType.js'

// Concrete implementation of HttpError for mapping
export class MappedHttpError extends HttpError {
	public statusCode: number

	constructor(params: {
		statusCode: number
		responseMessage: string
		name: string
		message: string
		code: unknown
		logLevel: LogLevel
		meta?: object
		cause?: unknown
	}) {
		super({
			...params,
			name: params.name,
			message: params.message,
			responseMessage: params.responseMessage,
		})
		this.statusCode = params.statusCode
	}
}
