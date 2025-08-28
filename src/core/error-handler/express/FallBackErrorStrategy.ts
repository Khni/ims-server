import { Response } from 'express'
import { createErrorResponse } from '../utils/createErrorResponse.js'
import { IErrorHandlingStrategy } from './interfaces/IErrorHandlingStrategy.js'
import { LogError } from '../LogError.js'

export class FallbackErrorStrategy implements IErrorHandlingStrategy {
	constructor(private logger: LogError) {}

	canHandle(err: Error): boolean {
		return true // always applies if no other does
	}

	handle(err: Error, res: Response): void {
		this.logger.logUnExpectedError(err)

		res.status(500).json(createErrorResponse({}))
	}
}
