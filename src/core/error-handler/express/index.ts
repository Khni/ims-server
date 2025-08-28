import { LogError } from '../LogError.js'
import { ErrorHandler } from './ErrorHandlerContext.js'
import { FallbackErrorStrategy } from './FallBackErrorStrategy.js'
import { HttpErrorStrategy } from './HttpErrorStrategy.js'
import { PrismaErrorStrategy } from './PrismaErrorStrategy.js'
import { ZodErrorStrategy } from './ZodErrorStrategy.js'

const logError = new LogError(console)

export const errHandler = new ErrorHandler([
	new HttpErrorStrategy(logError),
	new PrismaErrorStrategy(logError),
	new ZodErrorStrategy(logError),
	new FallbackErrorStrategy(logError),
]).handle
