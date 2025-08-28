// Express Strategies & Interfaces
export * from './express/ErrorHandlerContext.js'
export * from './express/FallBackErrorStrategy.js'
export * from './express/HttpErrorStrategy.js'
export * from './express/PrismaErrorStrategy.js'
export * from './express/ZodErrorStrategy.js'
export * from './express/interfaces/IErrorHandlingStrategy.js'

// Custom Errors
export * from './custom-errors/CustomError.js'

// HTTP Errors
export * from './http-errors/BadRequestError.js'
export * from './http-errors/ConflictError.js'
export * from './http-errors/ForbiddenError.js'
export * from './http-errors/InternalServerError.js'
export * from './http-errors/NotFoundError.js'
export * from './http-errors/RateLimitError.js'
export * from './http-errors/ServiceUnavailableError.js'
export * from './http-errors/UnauthorizedError.js'
export * from './http-errors/HttpError.js'

// Logger & Types
export * from './LogError.js'
export * from './ILogger.js'

//types
export type * from './types/CustomErrorType.js'
export type * from './types/HttpErrorType.js'
export type * from './types/LogLevelType.js'
export type * from './types/ErrorRes.js'
export type * from './types/InputValidationErrorRes.js'

//error handler middleware
export * from './express/index.js'

//mapper
export * from './mapper/MappedHttpError.js'
export * from './mapper/errorMapper.js'
