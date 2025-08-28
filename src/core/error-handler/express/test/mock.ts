import { Response } from 'express'
import { vi } from 'vitest'
import { LogError } from '../../LogError.js'

export const mockLogger: LogError = {
	logHttpError: vi.fn(),
	logPrismaError: vi.fn(),
	logUnExpectedError: vi.fn(),
} as any

export const mockResponse = () => {
	const res: any = {}
	res.status = vi.fn().mockReturnValue(res)
	res.json = vi.fn().mockReturnValue(res)
	res.send = vi.fn().mockReturnValue(res)
	return res as Response
}
