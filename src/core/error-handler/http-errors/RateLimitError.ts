import { HttpErrorType } from '../types/HttpErrorType.js'
import { HttpError } from './HttpError.js'

export class RateLimitError extends HttpError {
	statusCode = 429

	constructor(error?: Partial<HttpErrorType>) {
		super({
			name: 'RateLimitError',
			message: error?.message ?? 'Too many requests',
			responseMessage:
				error?.responseMessage ??
				'You have exceeded the rate limit. Please try again later.',
			code: error?.code ?? 'RATE_LIMIT_EXCEEDED',
			logLevel: error?.logLevel ?? 'warn',
			meta: error?.meta ?? {},
		})

		Object.setPrototypeOf(this, RateLimitError.prototype)
	}
}
