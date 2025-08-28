import { LogLevel } from './LogLevelType.js'

export type CustomErrorType<CodeType> = {
	message: string
	meta?: {}
	code: CodeType
	logLevel: LogLevel
	cause?: unknown
}
