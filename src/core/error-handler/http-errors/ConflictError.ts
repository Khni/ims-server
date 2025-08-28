import { HttpErrorType } from '../types/HttpErrorType.js'
import { HttpError } from './HttpError.js'

export class ConflictError extends HttpError {
	statusCode = 409

	constructor(error: HttpErrorType) {
		super({
			...error,
			responseMessage:
				error.responseMessage ||
				'ConflictError: A conflict occurred with the current state of the resource.',
		})
		Object.setPrototypeOf(this, ConflictError.prototype)
	}
}
