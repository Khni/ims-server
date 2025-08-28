import { HttpErrorType } from '../types/HttpErrorType.js'
import { HttpError } from './HttpError.js'

export class NotFoundError extends HttpError {
	statusCode = 404

	constructor(error: HttpErrorType) {
		super({
			...error,
			responseMessage:
				error.responseMessage || 'NotFoundError: The requested resource was not found.',
		})
		Object.setPrototypeOf(this, NotFoundError.prototype)
	}
}
