import { HttpErrorType } from '../types/HttpErrorType.js'
import { HttpError } from './HttpError.js'

export class BadRequestError extends HttpError {
	statusCode = 400

	constructor(error: HttpErrorType) {
		super({
			...error,
			responseMessage:
				error.responseMessage || 'BadRequestError: The request was invalid.',
		})
		Object.setPrototypeOf(this, BadRequestError.prototype)
	}
}
