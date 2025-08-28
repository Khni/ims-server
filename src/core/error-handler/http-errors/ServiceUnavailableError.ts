import { HttpErrorType } from '../types/HttpErrorType.js'
import { HttpError } from './HttpError.js'

export class ServiceUnavailableError extends HttpError {
	statusCode = 503

	constructor(error: HttpErrorType) {
		super({
			...error,
			responseMessage:
				error.responseMessage ||
				'ServiceUnavailableError: The service is currently unavailable. Please try again later.',
		})
		Object.setPrototypeOf(this, ServiceUnavailableError.prototype)
	}
}
