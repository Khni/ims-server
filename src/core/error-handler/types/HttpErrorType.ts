import { CustomErrorType } from "./CustomErrorType.js";
import { LogLevel } from "./LogLevelType.js";

export type HttpErrorType = CustomErrorType<unknown> & {
  responseMessage?: string;
  name: string;
} & {
  logLevel: LogLevel;
};
