import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { Response } from 'express'

import { createErrorResponse } from '../utils/createErrorResponse.js'
import { IErrorHandlingStrategy } from './interfaces/IErrorHandlingStrategy.js'
import { LogError } from '../LogError.js'

export class PrismaErrorStrategy implements IErrorHandlingStrategy {
	constructor(private logger: LogError) {}

	canHandle(err: Error): boolean {
		return err instanceof PrismaClientKnownRequestError
	}

	handle(err: Error, res: Response): void {
		const prismaError = err as PrismaClientKnownRequestError
		this.logger.logPrismaError(prismaError)

		res.status(500).json(createErrorResponse({}))
	}
}
