import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { ZodError } from 'zod'
import { ILogger } from './ILogger.js'
import { HttpError } from './http-errors/HttpError.js'

export class LogError {
	constructor(private logger: ILogger) {}

	logHttpError(error: HttpError) {
		const fullErrorChain = this.flattenErrorCauses(error)

		this.logger[error.logLevel]('HttpError', {
			topLevel: {
				name: error.name,
				message: error.message,
				code: error.code,
				logLevel: error.logLevel,
				responseMessage: error.responseMessage,
				meta: error.meta,
				stack: error.stack,
			},
			causeChain: fullErrorChain,
		})
	}

	logPrismaError(error: PrismaClientKnownRequestError) {
		this.logger.error('PrismaClientKnownRequestError', {
			topLevel: {
				name: error.name,
				message: error.message,
				code: error.code,

				meta: error.meta,
				stack: error.stack,
			},
		})
	}

	logZodError(error: ZodError) {
		const serializedIssues = error.issues.map((issue) => ({
			path: issue.path.join('.'),
			message: issue.message,
			code: issue.code,
		}))

		this.logger.warn('ZodError', {
			issues: serializedIssues,
		})
	}

	logUnExpectedError(error: Error) {
		const fullErrorChain = this.flattenErrorCauses(error)

		this.logger.error('UnExpectedError', {
			topLevel: {
				name: error.name,
				message: error.message,
				stack: error.stack,
			},
			causeChain: fullErrorChain,
		})
	}

	private flattenErrorCauses(error: unknown): Array<Record<string, any>> {
		const result: Array<Record<string, any>> = []
		let current: unknown = error

		while (current instanceof Error && current.cause) {
			current = current.cause

			if (current instanceof Error) {
				const causeInfo: Record<string, any> = {
					name: current.name,
					message: current.message,
					stack: current.stack,
				}

				// Copy other useful fields if present (code, responseMessage, etc.)
				if ('code' in current) causeInfo.code = (current as any).code
				if ('responseMessage' in current)
					causeInfo.responseMessage = (current as any).responseMessage
				if ('meta' in current) causeInfo.meta = (current as any).meta

				result.push(causeInfo)
			}
		}

		return result
	}
}
