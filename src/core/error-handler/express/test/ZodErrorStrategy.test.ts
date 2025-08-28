import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ZodError, z } from 'zod'
import type { Response } from 'express'
import { ZodErrorStrategy } from '../ZodErrorStrategy.js'
import { LogError } from '../../LogError.js'

describe('ZodErrorStrategy', () => {
	let strategy: ZodErrorStrategy
	let mockLogger: LogError
	let mockRes: Partial<Response>

	beforeEach(() => {
		mockLogger = {
			logZodError: vi.fn(),
		} as unknown as LogError

		strategy = new ZodErrorStrategy(mockLogger)

		mockRes = {
			status: vi.fn().mockReturnThis(),
			json: vi.fn(),
		}
	})

	it('should return true for ZodError in canHandle', () => {
		const schema = z.object({ email: z.string().email() })
		try {
			schema.parse({ email: 'invalid-email' })
		} catch (err) {
			expect(strategy.canHandle(err as Error)).toBe(true)
		}
	})

	it('should format and respond with ZodError details', () => {
		const schema = z.object({
			body: z.object({
				email: z.string().email(),
				age: z.number().min(18),
			}),
		})

		let zodErr: ZodError
		try {
			schema.parse({
				body: {
					email: 'invalid',
					age: 10,
				},
			})
		} catch (err) {
			zodErr = err as ZodError
			strategy.handle(zodErr!, mockRes as Response)

			expect(mockLogger.logZodError).toHaveBeenCalledWith(zodErr)
		}

		expect(mockRes.status).toHaveBeenCalledWith(400)
		expect(mockRes.json).toHaveBeenCalledWith({
			name: 'inputValidationError',
			errors: expect.arrayContaining([
				{
					field: 'email',
					messages: expect.arrayContaining([expect.stringMatching(/email/i)]),
				},
				{
					field: 'age',
					messages: expect.arrayContaining([expect.stringMatching(/18/i)]),
				},
			]),
		})
	})
})
