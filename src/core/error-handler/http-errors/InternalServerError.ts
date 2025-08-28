import { HttpErrorType } from '../types/HttpErrorType.js'
import { HttpError } from './HttpError.js'

export class InternalServerError extends HttpError {
	statusCode = 500

	constructor(error: HttpErrorType) {
		super({
			...error,
			responseMessage:
				error.responseMessage ||
				'InternalServerError: An unexpected error occurred on the server.',
		})
		Object.setPrototypeOf(this, InternalServerError.prototype)
	}
}
