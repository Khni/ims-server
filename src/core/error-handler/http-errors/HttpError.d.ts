import { HttpErrorType } from '../types/HttpErrorType.js';
import { LogLevel } from '../types/LogLevelType.js';
export declare abstract class HttpError extends Error {
    abstract statusCode: number;
    code: unknown;
    logLevel: LogLevel;
    meta?: {};
    responseMessage: string;
    constructor({ name, message, meta, code, logLevel, cause, responseMessage, }: HttpErrorType & {
        responseMessage: string;
    });
}
