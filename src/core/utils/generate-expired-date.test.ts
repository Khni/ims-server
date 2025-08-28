import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'
import { generateExpiredDate } from './generate-expired-date.js'

describe('generateExpiredDate', () => {
	beforeAll(() => {
		// Freeze time to a specific date for consistent tests
		vi.useFakeTimers()
		vi.setSystemTime(new Date(2023, 0, 1))
	})

	afterAll(() => {
		vi.useRealTimers()
	})

	it('should handle milliseconds correctly', () => {
		const result = generateExpiredDate('1000ms')
		const expected = new Date(new Date().getTime() + 1000)
		expect(result.getTime()).toBe(expected.getTime())
	})

	it('should handle seconds correctly', () => {
		const result = generateExpiredDate('30s')
		const expected = new Date(new Date().getTime() + 30 * 1000)
		expect(result.getTime()).toBe(expected.getTime())
	})

	it('should handle minutes correctly', () => {
		const result = generateExpiredDate('5m')
		const expected = new Date(new Date().getTime() + 5 * 60 * 1000)
		expect(result.getTime()).toBe(expected.getTime())
	})

	it('should handle hours correctly', () => {
		const result = generateExpiredDate('2h')
		const expected = new Date(new Date().getTime() + 2 * 60 * 60 * 1000)
		expect(result.getTime()).toBe(expected.getTime())
	})

	it('should handle days correctly', () => {
		const result = generateExpiredDate('3d')
		const expected = new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000)
		expect(result.getTime()).toBe(expected.getTime())
	})
})
