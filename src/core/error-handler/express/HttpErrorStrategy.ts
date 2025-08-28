import { Response } from 'express'

import { HttpError } from '../http-errors/HttpError.js'
import { createErrorResponse } from '../utils/createErrorResponse.js'
import { IErrorHandlingStrategy } from './interfaces/IErrorHandlingStrategy.js'
import { LogError } from '../LogError.js'

export class HttpErrorStrategy implements IErrorHandlingStrategy {
	constructor(private logError: LogError) {}

	canHandle(err: Error): boolean {
		return err instanceof HttpError
	}

	handle(err: Error, res: Response): void {
		const error = err as HttpError

		this.logError.logHttpError(error)

		res.status(error.statusCode).json(createErrorResponse(error))
	}
}
