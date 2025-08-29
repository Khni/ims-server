import { CustomErrorType } from "../types/CustomErrorType.js";
import { LogLevel } from "../types/LogLevelType.js";

export abstract class CustomError<CodeType> extends Error {
  public code: CodeType;
  public logLevel: LogLevel;
  public meta?: {};
  public message: string;

  constructor({
    name,
    message,
    meta,
    code,
    logLevel,
    cause,
  }: CustomErrorType<CodeType> & { name: string }) {
    super(message);

    this.name = name;
    this.message = message;
    this.meta = meta;
    this.code = code;
    this.logLevel = logLevel;
    this.cause = cause;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
