import { Response } from 'express'
import { ZodError } from 'zod'

import { InputValidationError } from '../types/InputValidationErrorRes.js'
import { IErrorHandlingStrategy } from './interfaces/IErrorHandlingStrategy.js'
import { LogError } from '../LogError.js'

export class ZodErrorStrategy implements IErrorHandlingStrategy {
	constructor(private logger: LogError) {}

	canHandle(err: Error): boolean {
		return err instanceof ZodError
	}

	handle(err: Error, res: Response): void {
		const zodError = err as ZodError

		const errors = zodError.issues.reduce((acc: Record<string, string[]>, error) => {
			const path = error.path.join('.')
			if (!acc[path]) {
				acc[path] = []
			}
			acc[path].push(error.message)
			return acc
		}, {})

		const formattedErrors: InputValidationError = {
			name: 'inputValidationError',
			errors: Object.entries(errors).map(([field, messages]) => ({
				field: field.replace('body.', ''),
				messages,
			})),
		}

		this.logger.logZodError(zodError)

		res.status(400).json(formattedErrors)
	}
}
