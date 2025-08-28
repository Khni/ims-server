import { NextFunction, Response, Request } from 'express'
import { createInputValidationErrorRes } from '../utils/create-error-response/createInputValidationErrorRes.js'
import { IErrorHandlingStrategy } from './interfaces/IErrorHandlingStrategy.js'

export class ErrorHandler {
	constructor(private strategies: IErrorHandlingStrategy[]) {}

	public handle = (err: Error, req: Request, res: Response, next: NextFunction): void => {
		const strategy = this.strategies.find((s) => s.canHandle(err))

		if (strategy) {
			strategy.handle(err, res)
		} else {
			// Optional: If no strategy found (shouldn't happen if Fallback is included)
			const errorResponse = createInputValidationErrorRes(
				'InternalServerError',
				'Unhandled error type',
			)
			res.status(500).send(errorResponse)
		}
	}
}
