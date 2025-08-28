import { describe, beforeEach, it, expect } from 'vitest'
import { getSafeNumberFromEnv } from './parse-safe-env-number.js'

describe('getSafeNumberFromEnv', () => {
	const originalEnv = process.env

	beforeEach(() => {
		process.env = { ...originalEnv }
	})

	it('returns the parsed number when the env var is a valid number', () => {
		process.env.TEST_NUMBER = '12345'
		expect(getSafeNumberFromEnv('TEST_NUMBER', 999)).toBe(12345)
	})

	it('returns the fallback when the env var is not a number', () => {
		process.env.TEST_NUMBER = 'abc'
		expect(getSafeNumberFromEnv('TEST_NUMBER', 999)).toBe(999)
	})

	it('returns the fallback when the env var is undefined', () => {
		delete process.env.TEST_NUMBER
		expect(getSafeNumberFromEnv('TEST_NUMBER', 999)).toBe(999)
	})

	it('parses negative numbers and zero correctly', () => {
		process.env.TEST_NUMBER = '-42'
		expect(getSafeNumberFromEnv('TEST_NUMBER', 999)).toBe(-42)

		process.env.TEST_NUMBER = '0'
		expect(getSafeNumberFromEnv('TEST_NUMBER', 999)).toBe(0)
	})
})
