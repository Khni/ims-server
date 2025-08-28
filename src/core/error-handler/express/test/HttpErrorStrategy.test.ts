import { describe, it, expect, vi, beforeEach } from 'vitest'

import { Response } from 'express'
import { HttpError } from '../../http-errors/HttpError.js'
import { HttpErrorStrategy } from '../HttpErrorStrategy.js'
import { mockLogger, mockResponse } from './mock.js'
class FakeHttpError extends HttpError {
	statusCode = 404
}

describe('HttpErrorStrategy', () => {
	let strategy: HttpErrorStrategy
	let res: Response

	beforeEach(() => {
		vi.clearAllMocks()
		strategy = new HttpErrorStrategy(mockLogger)
		res = mockResponse()
	})

	it('canHandle should return true for HttpError', () => {
		const err = new FakeHttpError({
			name: 'NotFoundError',
			message: 'Not found',
			responseMessage: 'Not found',
			logLevel: 'error',
			code: 'AUTH_ERROR',
		})

		expect(strategy.canHandle(err)).toBe(true)
	})

	it('should call logger and return serialized response', () => {
		const error = new FakeHttpError({
			name: 'NotFoundError',
			message: 'Not found',
			responseMessage: 'Not found',
			logLevel: 'error',
			code: 'AUTH_ERROR',
		})

		strategy.handle(error, res)

		expect(mockLogger.logHttpError).toHaveBeenCalledWith(error)

		expect(res.status).toHaveBeenCalledWith(404)
		expect(res.json).toHaveBeenCalledWith({
			message: error.message,
			code: error.code,
			name: error.name,
		})
		// const [, secondCallArgs] = mockLogger.error.mock.calls;

		// expect(secondCallArgs[0]).toBe("Not found");
		// expect(secondCallArgs[1]).toMatchObject({
		//   name: "NotFoundError",
		//   statusCode: 404,
		// });
	})
})
