import { HttpErrorType } from '../types/HttpErrorType.js'
import { HttpError } from './HttpError.js'

export class ForbiddenError extends HttpError {
	statusCode = 403

	constructor(error: HttpErrorType) {
		super({
			...error,
			responseMessage:
				error.responseMessage || 'ForbiddenError: Access to this resource is forbidden.',
		})
		Object.setPrototypeOf(this, ForbiddenError.prototype)
	}
}
