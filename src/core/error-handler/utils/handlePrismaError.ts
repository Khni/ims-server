import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { InternalServerError } from '../http-errors/InternalServerError.js'

export const handlePrismaError = ({
	error,
	message,
}: {
	error: unknown
	message: string
}): never => {
	if (error instanceof PrismaClientKnownRequestError) {
		throw new InternalServerError({
			name: error.name,
			message: error.message,
			meta: error.meta,
			logLevel: 'error',
			responseMessage: 'Internal Server Error',
			cause: error,
			code: 'ERROR',
		})
	}

	throw new InternalServerError({
		logLevel: 'error',
		name: 'UnknownDBError',
		message,
		responseMessage: 'Internal Server Error',
		cause: error,
		code: 'ERROR',
	})
}
