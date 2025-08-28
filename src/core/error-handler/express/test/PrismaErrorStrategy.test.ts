import { describe, it, expect, vi, beforeEach } from 'vitest'

import { Response } from 'express'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { createErrorResponse } from '../../utils/createErrorResponse.js'
import { PrismaErrorStrategy } from '../PrismaErrorStrategy.js'
import { mockLogger, mockResponse } from './mock.js'

describe('PrismaErrorStrategy', () => {
	let strategy: PrismaErrorStrategy
	let res: Response
	let err: PrismaClientKnownRequestError

	beforeEach(() => {
		vi.clearAllMocks()
		strategy = new PrismaErrorStrategy(mockLogger)
		res = mockResponse()
		err = new PrismaClientKnownRequestError('DB Error', {
			code: 'P222',
			clientVersion: '6.7',
		})
	})

	it('canHandle should return true for PrismaErrorStrategy', () => {
		expect(strategy.canHandle(err)).toBe(true)
	})

	it('should call logger and return serialized response', () => {
		strategy.handle(err, res)

		expect(mockLogger.logPrismaError).toHaveBeenCalledWith(err)

		expect(res.status).toHaveBeenCalledWith(500)
		expect(res.json).toHaveBeenCalledWith(createErrorResponse({}))
	})
})
