export interface ILogger {
	error(message: string, meta?: {}): void
	warn(message: string, meta?: {}): void
	info(message: string, meta?: {}): void
	debug(message: string, meta?: {}): void
}
