import { describe, it, expect, vi } from 'vitest'
import { ErrorHandler } from '../ErrorHandlerContext.js'
import { mockResponse } from './mock.js'

describe('ErrorHandler', () => {
	it('should delegate to the first matching strategy', () => {
		const strategy1 = {
			canHandle: vi.fn().mockReturnValue(false),
			handle: vi.fn(),
		}
		const strategy2 = {
			canHandle: vi.fn().mockReturnValue(true),
			handle: vi.fn(),
		}

		const errorHandler = new ErrorHandler([strategy1, strategy2])
		const err = new Error('test')
		const res = mockResponse()

		errorHandler.handle(err, {} as any, res, vi.fn())

		expect(strategy1.canHandle).toHaveBeenCalledWith(err)
		expect(strategy2.canHandle).toHaveBeenCalledWith(err)
		expect(strategy2.handle).toHaveBeenCalledWith(err, res)
		expect(strategy1.handle).not.toHaveBeenCalled()
	})
})
