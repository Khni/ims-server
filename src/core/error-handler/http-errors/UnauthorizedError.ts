import { HttpErrorType } from '../types/HttpErrorType.js'
import { HttpError } from './HttpError.js'

export class UnauthorizedError extends HttpError {
	statusCode = 401

	constructor(error: HttpErrorType) {
		super({
			...error,
			responseMessage:
				error.responseMessage ||
				'UnauthorizedError: You are not authorized to access this resource.',
		})
		Object.setPrototypeOf(this, UnauthorizedError.prototype)
	}
}
