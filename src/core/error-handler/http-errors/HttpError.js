export class HttpError extends Error {
    constructor({ name, message, meta, code, logLevel, cause, responseMessage, }) {
        super(message);
        this.name = name;
        this.message = message;
        this.meta = meta;
        this.code = code;
        this.logLevel = logLevel;
        this.cause = cause;
        this.responseMessage = responseMessage;
        Object.setPrototypeOf(this, new.target.prototype); // preserve prototype chain
    }
}
