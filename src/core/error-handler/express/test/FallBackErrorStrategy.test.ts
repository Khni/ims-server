import { describe, it, expect, vi, beforeEach } from 'vitest'
import { FallbackErrorStrategy } from '../FallBackErrorStrategy.js'
import { createErrorResponse } from '../../utils/createErrorResponse.js'
import { mockLogger, mockResponse } from './mock.js'
import { Response } from 'express'

describe('FallbackErrorStrategy', () => {
	let strategy: FallbackErrorStrategy
	let res: Response
	let err: Error

	beforeEach(() => {
		vi.clearAllMocks()
		strategy = new FallbackErrorStrategy(mockLogger)
		res = mockResponse()
		err = new Error('Unexpected Error')
	})

	it('FallbackErrorStrategy canHandle should return true for HttpError', () => {
		expect(strategy.canHandle(err)).toBe(true)
	})

	it('FallbackErrorStrategy should call logger and return serialized response', () => {
		strategy.handle(err, res)

		expect(mockLogger.logUnExpectedError).toHaveBeenCalledWith(err)

		expect(res.status).toHaveBeenCalledWith(500)
		expect(res.json).toHaveBeenCalledWith(createErrorResponse({}))
		// const [, secondCallArgs] = mockLogger.error.mock.calls;

		// expect(secondCallArgs[0]).toBe("Not found");
		// expect(secondCallArgs[1]).toMatchObject({
		//   name: "NotFoundError",
		//   statusCode: 404,
		// });
	})
})
